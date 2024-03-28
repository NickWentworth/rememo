import { trpcTransformer } from './client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';
import { TERM_ARGS } from '../types';

const prisma = new PrismaClient();

export async function createContext() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? '';

    const user = await prisma.user.findUnique({
        where: { email },
    });

    return {
        user,
    };
}

const t = initTRPC.context<typeof createContext>().create({
    transformer: trpcTransformer,
});

/** Unprotected procedure, no authentication required */
export const publicProcedure = t.procedure;

/** Procedure that requires the user to be authenticated */
export const authedProcedure = t.procedure.use((options) => {
    if (options.ctx.user === null) {
        throw new Error('UNAUTHORIZED');
    }

    return options.next({
        ctx: {
            user: options.ctx.user,
        },
    });
});

export const appRouter = t.router({
    term: {
        /** Fetch all terms that a user owns */
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

        // further term procedures...
    },

    // further user, course, task procedures...
});

export type AppRouter = typeof appRouter;
