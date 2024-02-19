import { PrismaClient, User } from '@prisma/client';
import { getServerSession, NextAuthOptions } from 'next-auth';
import Google, { GoogleProfile } from 'next-auth/providers/google';

const prisma = new PrismaClient();

export const LOGIN_ROUTE = '/login';

export const authOptions = {
    pages: {
        signIn: LOGIN_ROUTE,
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ profile, account }) {
            if (!account || !profile) {
                // something went wrong on sign in
                return false;
            }

            switch (account.provider) {
                case 'google':
                    const googleProfile = profile as GoogleProfile;

                    await prisma.user.upsert({
                        create: {
                            email: googleProfile.email,
                            name: googleProfile.name,
                            image: googleProfile.picture,
                        },
                        update: {
                            name: googleProfile.name,
                            image: googleProfile.picture,
                        },
                        where: {
                            email: googleProfile.email,
                        },
                    });

                    return true;

                default:
                    console.log(`${account.provider} is not a valid provider`);
                    return false;
            }
        },
    },
} satisfies NextAuthOptions;
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

/**
 * Returns an `User` from the database if the request is properly authorized.
 *
 * Throws an error if the user is not logged in
 *
 * Mainly intended for react-query as it expects an error if fetching went wrong
 */
export async function getServerUserOrThrow() {
    let session = await getServerSession(authOptions);
    let email = session?.user?.email;

    if (!email) {
        throw new Error('User is not signed in');
    }

    return await prisma.user.findUniqueOrThrow({
        where: { email },
    });
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
