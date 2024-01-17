import NextAuth, { NextAuthOptions } from 'next-auth';
import Google, { GoogleProfile } from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
