'use server';

import { PrismaClient } from '@prisma/client';
import { COURSE_ARGS, CoursePayload, payloadToCourse } from '../types';
import { getServerUserOrThrow } from '../auth';

const prisma = new PrismaClient();

/**
 * Returns all courses that a user owns or throws an error if unauthenticated
 */
export async function getCourses() {
    const user = await getServerUserOrThrow();

    return await prisma.course.findMany({
        where: {
            term: {
                userId: user.id,
            },
        },
        orderBy: [
            // TODO: within the select, have term name subsections for easier navigation
            // TODO: maybe even add user option to only show current semester in select?
            // this is used for showing courses in task form, order by term date first
            { term: { start: 'desc' } },
            // then name in the list
            { name: 'asc' },
        ],
        ...COURSE_ARGS,
    });
}

/**
 * Returns all courses that a user owns that reference the given termId
 *
 * Throws an error if unauthenticated
 */
export async function getCoursesByTermId(termId: string) {
    const user = await getServerUserOrThrow();

    return await prisma.course.findMany({
        where: {
            term: {
                id: termId,
                userId: user.id,
            },
        },
        orderBy: [{ name: 'asc' }],
        ...COURSE_ARGS,
    });
}

/**
 * Write a new course into the database, creating new course times when needed
 */
export async function createCourse(course: CoursePayload) {
    await getServerUserOrThrow();

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
}

/**
 * Update an existing course in the database, matched by id
 *
 * Handles creating, updating, and deleting any course times as needed
 */
export async function updateCourse(course: CoursePayload) {
    await getServerUserOrThrow();

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
}

/**
 * Delete a course in the database, given by term id
 */
export async function deleteCourse(id: string) {
    await getServerUserOrThrow();

    await prisma.course.delete({ where: { id } });
}
