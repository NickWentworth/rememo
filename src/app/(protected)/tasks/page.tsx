import TasksPage from './TasksPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Tasks' });

export default () => <TasksPage />;
