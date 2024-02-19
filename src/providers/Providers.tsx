import QueryProvider from './QueryProvider';
import UserProvider from './UserProvider';
import CourseProvider from './CourseProvider';
import TaskProvider from './TaskProvider';
import { COURSE_ARGS, TASK_ARGS } from '@/lib/types';
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

    const courses = await prisma.course.findMany({
        where: { term: { userId: user.id } },
        ...COURSE_ARGS,
    });

    const tasks = await prisma.task.findMany({
        where: { userId: user.id },
        ...TASK_ARGS,
    });

    return (
        <QueryProvider>
            <UserProvider user={user}>
                <CourseProvider courses={courses}>
                    <TaskProvider tasks={tasks}>{props.children}</TaskProvider>
                </CourseProvider>
            </UserProvider>
        </QueryProvider>
    );
}
