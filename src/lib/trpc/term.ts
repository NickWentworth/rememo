import { authedProcedure } from './server';
import { PrismaClient } from '@prisma/client';
import { TERM_ARGS, TermPayload } from '../types';
import { ZodType, z } from 'zod';

// TODO: streamline create/update/delete process on child tables (vacations, subtasks, course times)

const prisma = new PrismaClient();

const termFormSchema: ZodType<TermPayload> = z.object({
    id: z.string(),
    name: z.string(),
    start: z.date(),
    end: z.date(),
    vacations: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            start: z.date(),
            end: z.date(),
            termId: z.string(),
        })
    ),
    userId: z.string(),
});

export const TERM_PROCEDURES = {
    /**
     * Fetch all terms that a user owns
     */
    all: authedProcedure.query(async ({ ctx }) => {
        return await prisma.term.findMany({
            where: {
                userId: ctx.user.id,
            },
            orderBy: [
                // show latest term (likely closest to now) at the top of the page
                { start: 'desc' },
            ],
            ...TERM_ARGS,
        });
    }),

    /**
     * Upsert a term into the database, creating or updating an existing term if one exists
     *
     * Handles creating, updating, and deleting any vacations that are linked to this term
     */
    upsert: authedProcedure
        .input(termFormSchema)
        .mutation(async ({ input, ctx }) => {
            const { vacations, ...term } = input;

            // create new term or update existing term
            const upsertedTerm = await prisma.term.upsert({
                create: {
                    ...term,
                    id: undefined, // auto-generate id
                    userId: ctx.user.id, // set to logged-in user id
                },
                update: {
                    ...term,
                },
                where: {
                    id: term.id,
                },
                ...TERM_ARGS,
            });

            // upsert any new or existing vacations
            for (const vacation of vacations) {
                await prisma.termVacation.upsert({
                    create: {
                        ...vacation,
                        id: undefined, // auto-generate id
                        termId: upsertedTerm.id, // reference parent term
                    },
                    update: vacation,
                    where: { id: vacation.id },
                });
            }

            // and delete any vacations that were removed, if upserting a term
            const missingVacationIds = upsertedTerm.vacations
                .map((vacation) => vacation.id)
                .filter((id) =>
                    vacations.every((vacation) => vacation.id !== id)
                );

            await prisma.termVacation.deleteMany({
                where: {
                    id: {
                        in: missingVacationIds,
                    },
                },
            });

            return true;
        }),

    /**
     * Delete a term in the database, given by term id
     */
    remove: authedProcedure
        .input(z.string())
        .mutation(async ({ input: id }) => {
            await prisma.term.delete({ where: { id } });

            return true;
        }),
};
