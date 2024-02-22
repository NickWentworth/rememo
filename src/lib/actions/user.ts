'use server';

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

const prisma = new PrismaClient();

export async function getUserOrThrow() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? undefined;

    return await prisma.user.findUniqueOrThrow({
        where: { email },
    });
}
