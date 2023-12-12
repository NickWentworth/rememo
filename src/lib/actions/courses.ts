'use server';

import { PrismaClient } from '@prisma/client';
import { CoursePayload, payloadToCourse } from '../types';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/**
 * Write a new course into the database
 */
export async function createCourse(course: CoursePayload) {
    await prisma.course.create({
        data: {
            ...payloadToCourse(course),
            id: undefined, // generate term id
        },
    });

    revalidatePath('/courses');
}

/**
 * Update an existing course in the database, matched by id
 */
export async function updateCourse(course: CoursePayload) {
    await prisma.course.update({
        where: { id: course.id },
        data: payloadToCourse(course),
    });

    revalidatePath('/courses');
}

/**
 * Delete a course in the database, given by term id
 */
export async function deleteCourse(id: string) {
    await prisma.course.delete({ where: { id } });

    revalidatePath('/courses');
}
