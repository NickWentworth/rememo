import { PrismaClient } from '@prisma/client';
import { authedProcedure } from './server';

const prisma = new PrismaClient();

export const USER_PROCEDURES = {
    /**
     * Fetch the currently logged in user
     */
    get: authedProcedure.query(({ ctx }) => ctx.user),

    /**
     * Permanently delete the currently logged in user
     */
    permanentlyDelete: authedProcedure.mutation(async ({ ctx }) => {
        await prisma.user.delete({
            where: {
                id: ctx.user.id,
            },
        });

        return true;
    }),
};
