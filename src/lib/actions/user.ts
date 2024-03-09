'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

const prisma = new PrismaClient();

/**
 * Returns the currently logged in user or throws an error if not authenticated or found
 */
export async function getUserOrThrow() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? undefined;

    return await prisma.user.findUniqueOrThrow({
        where: { email },
    });
}

/**
 * Deletes the currently logged in user
 */
export async function deleteLoggedInUser() {
    const user = await getUserOrThrow();

    await prisma.user.delete({
        where: { id: user.id },
    });
}
