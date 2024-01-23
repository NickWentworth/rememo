import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient, User } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * Returns an `User` from the database if the request is properly authorized
 */
export async function getServerUser(): Promise<User | undefined> {
    let session = await getServerSession(authOptions);
    let email = session?.user?.email ?? undefined;

    try {
        let user = await prisma.user.findUniqueOrThrow({
            where: { email },
        });

        return user;
    } catch {
        if (!email) {
            console.error('User is not signed in');
        } else {
            console.error(`User does not exist with the email ${email}`);
        }

        return undefined;
    }
}

// TODO: it may be better to pass in a given user id to ensure any modified data is owned by the validated user
//       although a user is validated, they should not be able to modify other users' data
/**
 * Verifies that the user making a request is authorized
 */
export async function validateServerUser(): Promise<boolean> {
    const session = await getServerSession(authOptions);

    return session !== null;
}
