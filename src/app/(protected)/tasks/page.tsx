import { TaskWindow } from '@/components/windows/TaskWindow';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Tasks' });

export default function Tasks() {
    return <TaskWindow />;
}
