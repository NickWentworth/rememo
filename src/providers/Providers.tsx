import QueryProvider from './QueryProvider';
import UserProvider from './UserProvider';
import { authOptions, LOGIN_ROUTE } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ProviderProps = {
    children: React.ReactNode;
};

/**
 * Provides required app-wide data to subscribing components
 */
export default async function Providers(props: ProviderProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        // if the session does not exist, the user is not signed in
        console.log('User is not signed in, redirecting to login page.');
        redirect(LOGIN_ROUTE);
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? '' },
    });

    if (!user) {
        // if the session exists but not the user, they must have somehow been deleted but not logged out
        console.error('User may have been deleted, redirecting to login page.');
        redirect(LOGIN_ROUTE);
    }

    return (
        <QueryProvider>
            <UserProvider user={user}>{props.children}</UserProvider>
        </QueryProvider>
    );
}
