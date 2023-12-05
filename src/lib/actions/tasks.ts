'use server';

import { PrismaClient, Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();
const TEST_USER = '0';

/**
 * Write a new task into the database
 */
export async function createTask(task: Task) {
    await prisma.task.create({
        data: {
            ...task,
            id: undefined,
            userId: TEST_USER,
        },
    });

    revalidatePath('/tasks');
}

/**
 * Update a task already existing in the database, matched by id
 */
export async function updateTask(task: Task) {
    await prisma.task.update({
        where: { id: task.id },
        data: task,
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
 */
export async function setTaskCompletion(id: string, completed: boolean) {
    await prisma.task.update({
        where: { id },
        data: { completed },
    });

    revalidatePath('/tasks');
}
