import TaskCard from '@/components/TaskCard';

// TEMP - eventually fetch from database
import { Task } from '@prisma/client';
const TEST_TASK = {
    id: '891982476192',
    name: 'Homework',
    completed: false,
    due: new Date(),
    description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    course: 'Math',
    userId: '0',
} satisfies Task;
// ----

export default function Tasks() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 300px',
            }}
        >
            <TaskCard task={TEST_TASK} />
        </div>
    );
}
