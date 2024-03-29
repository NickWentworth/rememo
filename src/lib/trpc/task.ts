import { authedProcedure } from './server';
import { Prisma, PrismaClient } from '@prisma/client';
import { TASK_ARGS, TaskPayload } from '../types';
import { ZodType, z } from 'zod';
import { endOfWeek, nowUTC } from '../date';

const prisma = new PrismaClient();

const taskFormSchema: ZodType<TaskPayload> = z.object({
    id: z.string(),
    name: z.string(),
    completed: z.boolean(),
    due: z.date(),
    description: z.string(),
    subtasks: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            completed: z.boolean(),
            due: z.date(),
            taskId: z.string(),
        })
    ),
    // TODO: don't need to link course to task form, only need courseId
    course: z
        .object({
            id: z.string(),
            name: z.string(),
            color: z.string(),
        })
        .nullable(),
    courseId: z.string().nullable(),
    userId: z.string(),
});

const taskOptionsSchema = z.object({
    search: z.string(),
    show: z.enum(['current', 'past', 'this week']),
});

export type GetTaskOptions = z.infer<typeof taskOptionsSchema>;

const PAGE_SIZE = 10;

export const TASK_PROCEDURES = {
    /**
     * Fetch a paginated list of tasks that a user owns according to the given params,
     * containing exactly `PAGE_SIZE` tasks in the list
     *
     * Also returns a count of the remaining tasks to be fetched after this page, given the same params
     */
    withOptionsPaginated: authedProcedure
        .input(
            taskOptionsSchema.and(
                z.object({
                    cursor: z.string().optional(),
                })
            )
        )
        .query(async ({ input: params, ctx }) => {
            const search: Prisma.TaskWhereInput = {
                OR: [
                    // include task if any fields match the search
                    { name: { contains: params.search } },
                    { description: { contains: params.search } },
                    { course: { name: { contains: params.search } } },
                    {
                        subtasks: {
                            some: { name: { contains: params.search } },
                        },
                    },
                ],
            };

            // input filter to only include current tasks (incomplete or not yet due)
            const currentTasks: Prisma.TaskWhereInput = {
                OR: [{ completed: false }, { due: { gte: nowUTC() } }],
            };

            // change include filter and outputted order based on include option
            let include: Prisma.TaskWhereInput;
            let dueOrder: Prisma.SortOrder;
            switch (params.show) {
                case 'current':
                    include = currentTasks;
                    dueOrder = 'asc';
                    break;

                case 'past':
                    include = { NOT: currentTasks };
                    dueOrder = 'desc';
                    break;

                case 'this week':
                    include = {
                        AND: [currentTasks, { due: { lte: endOfWeek() } }],
                    };
                    dueOrder = 'asc';
                    break;
            }

            // fetch the paginated list of tasks
            const tasks = await prisma.task.findMany({
                where: {
                    userId: ctx.user.id,
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
                // take an extra task to set as the next cursor
                take: PAGE_SIZE + 1,
                // either use cursor or take from the start
                cursor: params.cursor ? { id: params.cursor } : undefined,
            });

            // if there are further tasks, return a cursor (id) to the next in line
            let nextCursor: typeof params.cursor = undefined;
            if (tasks.length === PAGE_SIZE + 1) {
                const next = tasks.pop();
                nextCursor = next!.id;
            }

            return { tasks, nextCursor };
        }),

    /**
     * Upsert a task into the database, creating or updating an existing task if one exists
     *
     * Handles creating, updating, and deleting any subtasks that are linked to this term
     */
    upsert: authedProcedure
        .input(taskFormSchema)
        .mutation(async ({ input, ctx }) => {
            const { subtasks, course, ...task } = input;

            // create a new task or update existing course
            const upsertedTask = await prisma.task.upsert({
                create: {
                    ...task,
                    id: undefined, // auto-generate id
                    userId: ctx.user.id, // set to logged-in user id
                },
                update: task,
                where: { id: task.id },
                ...TASK_ARGS,
            });

            // upsert any new or existing subtasks
            for (const subtask of subtasks) {
                await prisma.subtask.upsert({
                    create: {
                        ...subtask,
                        id: undefined, // auto-generate id
                        taskId: upsertedTask.id, // reference parent task
                    },
                    update: subtask,
                    where: { id: subtask.id },
                });
            }

            // and delete any subtasks that were removed, if upserting a task
            const missingTimeIds = upsertedTask.subtasks
                .map((subtask) => subtask.id)
                .filter((id) => subtasks.every((subtask) => subtask.id !== id));

            await prisma.subtask.deleteMany({
                where: {
                    id: {
                        in: missingTimeIds,
                    },
                },
            });

            return true;
        }),

    /**
     * Delete a task in the database, given by task id
     */
    remove: authedProcedure
        .input(z.string())
        .mutation(async ({ input: id }) => {
            await prisma.task.delete({
                where: { id },
            });

            return true;
        }),

    /**
     * Update a task's (given by id) completion state
     *
     * Updates the children subtasks' completion state based on a "select all" style of completion,
     * setting all children to match the parent task's completion state
     */
    setTaskCompletion: authedProcedure
        .input(
            z.object({
                id: z.string(),
                completed: z.boolean(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, completed } = input;

            // update the given task id
            await prisma.task.update({
                where: { id },
                data: { completed },
            });

            // and any subtasks of that parent task as well
            await prisma.subtask.updateMany({
                where: { taskId: id },
                data: { completed },
            });

            return true;
        }),

    /**
     * Update a subtask's (given by id) completion state
     *
     * Updates the parent task's completion state based on a "select all" style of completion:
     * - If all sibling subtasks are completed, set parent to completed
     * - If any sibling subtask is not completed, set parent to not completed
     */
    setSubtaskCompletion: authedProcedure
        .input(
            z.object({
                id: z.string(),
                completed: z.boolean(),
            })
        )
        .mutation(async ({ input }) => {
            const { id, completed } = input;

            // update just this subtask's completion state
            const subtask = await prisma.subtask.update({
                where: { id },
                data: { completed },
            });

            // get all sibling subtasks with the same task completion
            const subtaskSiblings = await prisma.subtask.findMany({
                where: { taskId: subtask.taskId },
            });
            const parentTaskCompletion = subtaskSiblings.every(
                (s) => s.completed
            );

            // update parent task's completion state
            await prisma.task.update({
                where: { id: subtask.taskId },
                data: { completed: parentTaskCompletion },
            });

            return true;
        }),
};
