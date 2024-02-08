'use server';

import { PrismaClient } from '@prisma/client';
import { CoursePayload, payloadToCourse } from '../types';
import { validateServerUser } from '../auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/**
 * Write a new course into the database, creating new course times when needed
 */
export async function createCourse(course: CoursePayload) {
    if (!(await validateServerUser())) {
        return;
    }

    // create new course
    const createdCourse = await prisma.course.create({
        data: {
            ...payloadToCourse(course),
            id: undefined, // generate term id
        },
    });

    // and create new course times if needed
    for (const time of course.times) {
        await prisma.courseTime.create({
            data: {
                ...time,
                id: undefined, // generate course time id
                courseId: createdCourse.id, // line course time to parent course
            },
        });
    }

    revalidatePath('/courses');
}

/**
 * Update an existing course in the database, matched by id
 *
 * Handles creating, updating, and deleting any course times as needed
 */
export async function updateCourse(course: CoursePayload) {
    if (!(await validateServerUser())) {
        return;
    }

    // update the course
    const updatedCourse = await prisma.course.update({
        where: { id: course.id },
        data: payloadToCourse(course),
        include: {
            times: true,
        },
    });

    // upsert any subtasks needing to be created or updated
    for (const time of course.times) {
        await prisma.courseTime.upsert({
            create: {
                ...time,
                id: undefined,
                courseId: course.id,
            },
            update: time,
            where: { id: time.id },
        });
    }

    // and finally delete any subtasks that are missing from received data
    const missingCourseTimeIds = updatedCourse.times
        .map((time) => time.id)
        .filter((id) => course.times.every((time) => time.id !== id));

    await prisma.courseTime.deleteMany({
        where: {
            id: {
                in: missingCourseTimeIds,
            },
        },
    });

    revalidatePath('/courses');
}

/**
 * Delete a course in the database, given by term id
 */
export async function deleteCourse(id: string) {
    if (!(await validateServerUser())) {
        return;
    }

    await prisma.course.delete({ where: { id } });

    revalidatePath('/courses');
}
