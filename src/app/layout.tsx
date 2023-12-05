import Sidebar from '@/components/Sidebar';
import {
    CourseProvider,
    TaskProvider,
    TermProvider,
} from '@/components/providers';
import { PrismaClient } from '@prisma/client';
import './global.css';

const prisma = new PrismaClient();
const TEST_USER = '0';

type LayoutProps = {
    children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
    const terms = await prisma.term.findMany({ where: { userId: TEST_USER } });

    const courses = await prisma.course.findMany({
        where: { term: { userId: TEST_USER } },
    });

    const tasks = await prisma.task.findMany({ where: { userId: TEST_USER } });

    return (
        <html>
            <body>
                <TermProvider data={terms}>
                    <CourseProvider data={courses}>
                        <TaskProvider data={tasks}>
                            <Sidebar />
                            {props.children}
                        </TaskProvider>
                    </CourseProvider>
                </TermProvider>
            </body>
        </html>
    );
}
