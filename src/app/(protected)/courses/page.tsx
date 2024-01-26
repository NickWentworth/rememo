import CoursesPage from './CoursesPage';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Courses' });

export default function Courses() {
    // extract courses page into its own component because it requires 'use client', which collides with metadata
    return <CoursesPage />;
}
