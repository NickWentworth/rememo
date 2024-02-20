'use server';

import { PrismaClient } from '@prisma/client';
import { TASK_ARGS, TaskPayload, payloadToTask } from '../types';
import { getServerUserOrThrow, validateServerUser } from '../auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/**
 * Returns all tasks that a user owns or throws an error if unauthenticated
 */
export async function getTasks() {
    const user = await getServerUserOrThrow();

    return await prisma.task.findMany({
        where: {
            userId: user.id,
        },
        ...TASK_ARGS,
    });
}

/**
 * Write a new task into the database, creating new subtasks when needed
 */
export async function createTask(task: TaskPayload) {
    const user = await getServerUserOrThrow();

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
    await getServerUserOrThrow();

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
    await getServerUserOrThrow();

    await prisma.task.delete({ where: { id } });
}

/**
 * Update a task's (given by id) completion state
 *
 * Updates the children subtasks' completion state based on a "select all" style of completion,
 * setting all children to match the parent task's completion state
 */
export async function setTaskCompletion(id: string, completed: boolean) {
    await getServerUserOrThrow();

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
    await getServerUserOrThrow();

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
