import { trpcTransformer } from './client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { initTRPC } from '@trpc/server';

const prisma = new PrismaClient();

const t = initTRPC.create({
    transformer: trpcTransformer,
});

export const router = t.router;

/** Unprotected procedure, no authentication required */
export const publicProcedure = t.procedure;

/** Procedure that requires the user to be authenticated */
export const authedProcedure = t.procedure.use(async (options) => {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? '';

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user === null) {
        throw new Error('Error 401 (Unauthorized)');
    }

    return options.next({
        ctx: {
            user,
        },
    });
});
