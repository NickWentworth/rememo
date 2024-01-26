import { CalendarWindow } from '@/components/windows/CalendarWindow';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Calendar' });

export default function Calendar() {
    return <CalendarWindow display='week' />;
}
