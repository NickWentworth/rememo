'use server';

import { PrismaClient } from '@prisma/client';
import { TaskPayload, payloadToTask } from '../types';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// TODO: create or update subtasks as well as tasks

/**
 * Write a new task into the database
 */
export async function createTask(task: TaskPayload) {
    await prisma.task.create({
        data: {
            ...payloadToTask(task),
            id: undefined, // generate task id
        },
    });

    revalidatePath('/tasks');
}

/**
 * Update a task already existing in the database, matched by id
 */
export async function updateTask(task: TaskPayload) {
    await prisma.task.update({
        where: { id: task.id },
        data: payloadToTask(task),
    });

    revalidatePath('/tasks');
}

/**
 * Delete a task in the database, given by task id
 */
export async function deleteTask(id: string) {
    await prisma.task.delete({ where: { id } });

    revalidatePath('/tasks');
}

/**
 * Update a task's (given by id) completion state
 *
 * Updates the children subtasks' completion state based on a "select all" style of completion,
 * setting all children to match the parent task's completion state
 */
export async function setTaskCompletion(id: string, completed: boolean) {
    await prisma.task.update({
        where: { id },
        data: { completed },
    });

    // update all subtasks referencing this task completed as well
    await prisma.subtask.updateMany({
        where: { taskId: id },
        data: { completed },
    });

    revalidatePath('/tasks');
}

/**
 * Update a subtask's (given by id) completion state
 *
 * Updates the parent task's completion state based on a "select all" style of completion:
 * - If all sibling subtasks are completed, set parent to completed
 * - If any sibling subtask is not completed, set parent to not completed
 */
export async function setSubtaskCompletion(id: string, completed: boolean) {
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

    revalidatePath('/tasks');
}
