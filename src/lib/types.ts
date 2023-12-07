import { Prisma, Task as TaskRaw } from '@prisma/client';

// built frontend types from prisma generated payloads

// ------------------------------ terms ------------------------------ //
export type TermPayload = Prisma.TermGetPayload<typeof TERM_ARGS>;

export const TERM_ARGS = {} satisfies Prisma.TermDefaultArgs;

// ------------------------------ courses ------------------------------ //
export type CoursePayload = Prisma.CourseGetPayload<typeof COURSE_ARGS>;

export const COURSE_ARGS = {} satisfies Prisma.CourseDefaultArgs;

// ------------------------------ tasks ------------------------------ //
export type TaskPayload = Prisma.TaskGetPayload<typeof TASK_ARGS>;

export const TASK_ARGS = {
    include: {
        subtasks: true,
    },
} satisfies Prisma.TaskDefaultArgs;

export const DEFAULT_TASK = {
    id: '',
    name: '',
    completed: false,
    due: new Date(),
    description: '',
    subtasks: [],
    courseId: null,
    userId: '',
} satisfies TaskPayload;

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
