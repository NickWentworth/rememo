import Sidebar from '@/components/Sidebar';
import {
    CourseProvider,
    TaskProvider,
    TermProvider,
} from '@/components/providers';
import { TERM_ARGS, COURSE_ARGS, TASK_ARGS } from '@/lib/types';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { AuthProvider } from './providers';
import './global.css';

const prisma = new PrismaClient();
const TEST_USER = '0';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
    const session = await getServerSession();

    const terms = await prisma.term.findMany({
        where: { userId: TEST_USER },
        ...TERM_ARGS,
    });

    const courses = await prisma.course.findMany({
        where: { term: { userId: TEST_USER } },
        ...COURSE_ARGS,
    });

    const tasks = await prisma.task.findMany({
        where: { userId: TEST_USER },
        ...TASK_ARGS,
    });

    return (
        <html>
            <body>
                <TermProvider data={terms}>
                    <CourseProvider data={courses}>
                        <TaskProvider data={tasks}>
                            <AuthProvider session={session}>
                                <Sidebar />
                                {props.children}
                            </AuthProvider>
                        </TaskProvider>
                    </CourseProvider>
                </TermProvider>
            </body>
        </html>
    );
}
