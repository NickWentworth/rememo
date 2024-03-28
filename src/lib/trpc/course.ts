import { authedProcedure } from './server';
import { bitfieldToList } from '@/lib/bitfield';
import { PrismaClient } from '@prisma/client';
import { COURSE_ARGS, CoursePayload } from '../types';
import { ZodType, z } from 'zod';

const prisma = new PrismaClient();

const courseFormSchema: ZodType<CoursePayload> = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    instructor: z.string().nullable(),
    location: z.string().nullable(),
    times: z.array(
        z.object({
            id: z.string(),
            start: z.date(),
            end: z.date(),
            days: z.number(),
            courseId: z.string(),
        })
    ),
    termId: z.string(),
});

export const COURSE_PROCEDURES = {
    /**
     * Fetch basic data about a course for use in a select input element
     *
     * Only provides course's id, name, and color
     */
    allBasic: authedProcedure.query(async ({ ctx }) => {
        return await prisma.course.findMany({
            where: {
                term: { userId: ctx.user.id },
            },
            orderBy: [
                // this is used for showing courses in task form, order by term date first
                { term: { start: 'desc' } },
                // then course name
                { name: 'asc' },
            ],
            select: {
                id: true,
                name: true,
                color: true,
            },
        });
    }),

    /**
     * Fetch all courses that reference the given termId
     */
    byTermId: authedProcedure
        .input(z.string().optional())
        .query(async ({ input: termId, ctx }) => {
            return await prisma.course.findMany({
                where: {
                    term: {
                        // if termId is undefined, this should return nothing
                        id: termId ?? '',
                        userId: ctx.user.id,
                    },
                },
                orderBy: [{ name: 'asc' }],
                ...COURSE_ARGS,
            });
        }),

    /**
     * Fetch a list of course times for each given `Date` in input array
     *
     * Time value of each date is ignored, the entire day is counted
     */
    timesByDateArray: authedProcedure
        .input(z.array(z.date()))
        .query(async ({ input: dates, ctx }) => {
            const times = dates.map((date) =>
                getCourseTimesByDate(date, ctx.user.id)
            );

            return await Promise.all(times);
        }),

    /**
     * Upsert a course into the database, creating or updating an existing course if one exists
     *
     * Handles creating, updating, and deleting any vacations that are linked to this term
     */
    upsert: authedProcedure
        .input(courseFormSchema)
        .mutation(async ({ input }) => {
            const { times, ...course } = input;

            // create a new course or update existing course
            const upsertedCourse = await prisma.course.upsert({
                create: {
                    ...course,
                    id: undefined, // auto-generate id
                },
                update: course,
                where: { id: course.id },
                ...COURSE_ARGS,
            });

            // upsert any new or existing times
            for (const time of times) {
                await prisma.courseTime.upsert({
                    create: {
                        ...time,
                        id: undefined, // auto-generate id
                        courseId: upsertedCourse.id, // reference parent course
                    },
                    update: time,
                    where: { id: time.id },
                });
            }

            // and delete any times that were removed, if upserting a term
            const missingTimeIds = upsertedCourse.times
                .map((time) => time.id)
                .filter((id) => times.every((time) => time.id !== id));

            await prisma.courseTime.deleteMany({
                where: {
                    id: {
                        in: missingTimeIds,
                    },
                },
            });

            return true;
        }),

    /**
     * Delete a course in the database, given by course id
     */
    remove: authedProcedure
        .input(z.string())
        .mutation(async ({ input: id }) => {
            await prisma.course.delete({
                where: { id },
            });

            return true;
        }),
};

/**
 * Returns a list of course times that take place on a given day, checking for term ranges as well
 *
 * Includes course data used for the calendar, such as name, color, and location
 */
async function getCourseTimesByDate(date: Date, userId: string) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 0, 0);

    const dayOfWeek = date.getDay();

    // get all times for courses that are in the correct time range
    const times = await prisma.courseTime.findMany({
        where: {
            course: {
                term: {
                    start: { lte: endOfDay },
                    end: { gte: startOfDay },
                    userId,

                    // TODO: signal in the calendar that a vacation is occurring on these days
                    // ignore course times that occur during term vacations
                    vacations: {
                        none: {
                            start: { lte: endOfDay },
                            end: { gte: startOfDay },
                        },
                    },
                },
            },
        },
        include: {
            course: {
                select: {
                    name: true,
                    color: true,
                    location: true,
                },
            },
        },
    });

    // and manually filter out any that do not occur on this day of the week
    return times.filter((time) =>
        bitfieldToList(time.days).includes(dayOfWeek)
    );
}
