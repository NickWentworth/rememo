import { PrismaClient } from '@prisma/client';
import { NextAuthOptions, getServerSession } from 'next-auth';
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
 * Returns whether or not the user is authenticated and exists
 */
export async function isAuthenticated() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email ?? '';

    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user !== null;
}
