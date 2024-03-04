import Calendar from '@/components/Calendar';
import Panel from '@/components/Panel';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Calendar' });

export default function CalendarPage() {
    return (
        <Panel
            header={<h1>Calendar</h1>}
            body={<Calendar display='week' initialTime={7} />}
            flex={1}
        />
    );
}
