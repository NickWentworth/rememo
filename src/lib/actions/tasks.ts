'use server';

import { Prisma, PrismaClient } from '@prisma/client';
import { TASK_ARGS, TaskPayload, payloadToTask } from '../types';
import { getUserOrThrow } from './user';
import { nowUTC } from '../date';

const prisma = new PrismaClient();

export type GetTaskOptions = {
    search: string;
    show: 'current' | 'past';
    // TODO: pagination
};

/**
 * Returns tasks that a user owns according to given options
 *
 * Throws an error if unauthenticated
 */
export async function getTasks(options: GetTaskOptions) {
    const user = await getUserOrThrow();

    const search: Prisma.TaskWhereInput = {
        OR: [
            // include task if any fields match the search
            { name: { contains: options.search } },
            { description: { contains: options.search } },
            { course: { name: { contains: options.search } } },
            { subtasks: { some: { name: { contains: options.search } } } },
        ],
    };

    // input filter to only include current tasks (incomplete or not yet due)
    const currentTasks: Prisma.TaskWhereInput = {
        OR: [{ completed: false }, { due: { gt: nowUTC() } }],
    };

    // change include filter and outputted order based on include option
    let include: Prisma.TaskWhereInput;
    let dueOrder: Prisma.SortOrder;
    switch (options.show) {
        case 'current':
            include = currentTasks;
            dueOrder = 'asc';
            break;

        case 'past':
            include = { NOT: currentTasks };
            dueOrder = 'desc';
            break;
    }

    return await prisma.task.findMany({
        where: {
            userId: user.id,
            AND: [search, include],
        },
        orderBy: [
            { due: dueOrder },
            // then group by course
            { course: { name: 'asc' } },
            // finally order by name
            { name: 'asc' },
        ],
        ...TASK_ARGS,
    });
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
