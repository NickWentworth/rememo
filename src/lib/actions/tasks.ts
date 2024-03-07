'use server';

import { Prisma, PrismaClient } from '@prisma/client';
import { TASK_ARGS, TaskPayload, payloadToTask } from '../types';
import { getUserOrThrow } from './user';
import { endOfWeek, nowUTC } from '../date';

const prisma = new PrismaClient();

export type GetTaskOptions = {
    search: string;
    show: 'current' | 'past' | 'this week';
};

type GetTaskParams = GetTaskOptions & {
    page: number;
};

const PAGE_SIZE = 10;

/**
 * Returns a paginated list of tasks that a user owns according to given options, along with
 * a number to use for fetching the next list of tasks, or `undefined` if no more exist
 *
 * Throws an error if unauthenticated
 */
export async function getPaginatedTasks(params: GetTaskParams) {
    const user = await getUserOrThrow();

    const search: Prisma.TaskWhereInput = {
        OR: [
            // include task if any fields match the search
            { name: { contains: params.search } },
            { description: { contains: params.search } },
            { course: { name: { contains: params.search } } },
            { subtasks: { some: { name: { contains: params.search } } } },
        ],
    };

    // input filter to only include current tasks (incomplete or not yet due)
    const currentTasks: Prisma.TaskWhereInput = {
        OR: [{ completed: false }, { due: { gte: nowUTC() } }],
    };

    // change include filter and outputted order based on include option
    let include: Prisma.TaskWhereInput;
    let dueOrder: Prisma.SortOrder;
    switch (params.show) {
        case 'current':
            include = currentTasks;
            dueOrder = 'asc';
            break;

        case 'past':
            include = { NOT: currentTasks };
            dueOrder = 'desc';
            break;

        case 'this week':
            include = {
                AND: [currentTasks, { due: { lte: endOfWeek() } }],
            };
            dueOrder = 'asc';
            break;
    }

    // pre-build where and orderBy as they are used multiple times
    const where: Prisma.TaskWhereInput = {
        userId: user.id,
        AND: [search, include],
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput[] = [
        { due: dueOrder },
        // then group by course
        { course: { name: 'asc' } },
        // finally order by name
        { name: 'asc' },
    ];

    // fetch the paginated list of tasks
    const tasks = await prisma.task.findMany({
        where,
        orderBy,
        ...TASK_ARGS,
        take: PAGE_SIZE,
        skip: params.page * PAGE_SIZE,
    });

    // and determine whether there are more tasks remaining
    const areMoreTasks =
        tasks.length === PAGE_SIZE &&
        (await prisma.task.findFirst({
            where,
            orderBy,
            skip: (params.page + 1) * PAGE_SIZE,
        })) !== null;

    return {
        tasks,
        next: areMoreTasks ? params.page + 1 : undefined,
    };
}

/**
 * Write a new task into the database, creating new subtasks when needed
 */
export async function createTask(task: TaskPayload) {
    const user = await getUserOrThrow();

    // create new task
    const createdTask = await prisma.task.create({
        data: {
            ...payloadToTask(task),
            id: undefined, // generate task id
            userId: user.id,
        },
    });

    // and create new subtasks if needed
    for (const subtask of task.subtasks) {
        await prisma.subtask.create({
            data: {
                ...subtask,
                id: undefined, // generate subtask id
                taskId: createdTask.id, // link subtask to parent task
            },
        });
    }
}

/**
 * Update a task already existing in the database, matched by id
 *
 * Handles creating, updating, and deleting any subtasks as needed
 */
export async function updateTask(task: TaskPayload) {
    await getUserOrThrow();

    // update the task
    const updatedTask = await prisma.task.update({
        where: { id: task.id },
        data: payloadToTask(task),
        include: {
            subtasks: true,
        },
    });

    // upsert any subtasks needing to be created or updated
    for (const subtask of task.subtasks) {
        await prisma.subtask.upsert({
            create: {
                ...subtask,
                id: undefined,
                taskId: task.id,
            },
            update: subtask,
            where: { id: subtask.id },
        });
    }

    // and finally delete any subtasks that are missing from received data
    const missingSubtaskIds = updatedTask.subtasks
        .map((subtask) => subtask.id)
        .filter((id) => task.subtasks.every((subtask) => subtask.id !== id));

    await prisma.subtask.deleteMany({
        where: {
            id: {
                in: missingSubtaskIds,
            },
        },
    });
}

/**
 * Delete a task in the database, given by task id
 */
export async function deleteTask(id: string) {
    await getUserOrThrow();

    await prisma.task.delete({ where: { id } });
}

/**
 * Update a task's (given by id) completion state
 *
 * Updates the children subtasks' completion state based on a "select all" style of completion,
 * setting all children to match the parent task's completion state
 */
export async function setTaskCompletion(id: string, completed: boolean) {
    await getUserOrThrow();

    await prisma.task.update({
        where: { id },
        data: { completed },
    });

    // update all subtasks referencing this task completed as well
    await prisma.subtask.updateMany({
        where: { taskId: id },
        data: { completed },
    });
}

/**
 * Update a subtask's (given by id) completion state
 *
 * Updates the parent task's completion state based on a "select all" style of completion:
 * - If all sibling subtasks are completed, set parent to completed
 * - If any sibling subtask is not completed, set parent to not completed
 */
export async function setSubtaskCompletion(id: string, completed: boolean) {
    await getUserOrThrow();

    // update just this subtask's completion state
    const subtask = await prisma.subtask.update({
        where: { id },
        data: { completed },
    });

    // get all sibling subtasks with the same task completion
    const subtaskSiblings = await prisma.subtask.findMany({
        where: { taskId: subtask.taskId },
    });
    const parentTaskCompletion = subtaskSiblings.every((s) => s.completed);

    // update parent task's completion state
    await prisma.task.update({
        where: { id: subtask.taskId },
        data: { completed: parentTaskCompletion },
    });
}
