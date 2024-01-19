import UserProvider from './UserProvider';
import TermProvider from './TermProvider';
import CourseProvider from './CourseProvider';
import TaskProvider from './TaskProvider';
import { COURSE_ARGS, TASK_ARGS, TERM_ARGS } from '@/lib/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? undefined },
    });

    if (!user) {
        throw new Error('Something went wrong providing the user');
    }

    const terms = await prisma.term.findMany({
        where: { userId: user.id },
        ...TERM_ARGS,
    });

    const courses = await prisma.course.findMany({
        where: { term: { userId: user.id } },
        ...COURSE_ARGS,
    });

    const tasks = await prisma.task.findMany({
        where: { userId: user.id },
        ...TASK_ARGS,
    });

    return (
        <UserProvider user={user}>
            <TermProvider terms={terms}>
                <CourseProvider courses={courses}>
                    <TaskProvider tasks={tasks}>{props.children}</TaskProvider>
                </CourseProvider>
            </TermProvider>
        </UserProvider>
    );
}
