import { Prisma } from '@prisma/client';
import type {
    Course as CourseRaw,
    Task as TaskRaw,
    Term as TermRaw,
} from '@prisma/client';

// built frontend types from prisma generated payloads

// ------------------------------ terms ------------------------------ //
export type TermPayload = Prisma.TermGetPayload<typeof TERM_ARGS>;

export const TERM_ARGS = {} satisfies Prisma.TermDefaultArgs;

/**
 * Converts a frontend `TermPayload` object to a backend `Term` object
 */
export function payloadToTerm(payload: TermPayload): TermRaw {
    return payload;
}

// ------------------------------ courses ------------------------------ //
export type CoursePayload = Prisma.CourseGetPayload<typeof COURSE_ARGS>;

export const COURSE_ARGS = {
    include: {
        times: true,
    },
} satisfies Prisma.CourseDefaultArgs;

/**
 * Converts a frontend `CoursePayload` object to a backend `Course` object
 */
export function payloadToCourse(payload: CoursePayload): CourseRaw {
    const { times, ...course } = payload;

    return course;
}

// ------------------------------ tasks ------------------------------ //
export type TaskPayload = Prisma.TaskGetPayload<typeof TASK_ARGS>;

export const TASK_ARGS = {
    include: {
        subtasks: true,
    },
} satisfies Prisma.TaskDefaultArgs;

/**
 * Converts a frontend `TaskPayload` object to a backend `Task` object
 */
export function payloadToTask(payload: TaskPayload): TaskRaw {
    const { subtasks, ...task } = payload;

    return task;
}

/**
 * Converts a backend `Task` object to a frontend `TaskPayload` object
 *
 * This likely shouldn't be used, instead use `TASK_ARGS` when querying prisma
 */
export function taskToPayload(task: TaskRaw): TaskPayload {
    return {
        ...task,
        subtasks: [],
    };
}
