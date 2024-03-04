import CoursesPage from './CoursesPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Courses' });

export default () => <CoursesPage />;
