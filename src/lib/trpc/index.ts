import { router } from './server';
import { TERM_PROCEDURES } from './term';
import { COURSE_PROCEDURES } from './course';
import { TASK_PROCEDURES } from './task';

export const appRouter = router({
    // user: USER_PROCEDURES,
    term: TERM_PROCEDURES,
    course: COURSE_PROCEDURES,
    task: TASK_PROCEDURES,
});

export type AppRouter = typeof appRouter;
