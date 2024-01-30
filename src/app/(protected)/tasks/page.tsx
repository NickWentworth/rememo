import { TaskWindow } from '@/components/windows';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Tasks' });

export default function Tasks() {
    return <TaskWindow />;
}
