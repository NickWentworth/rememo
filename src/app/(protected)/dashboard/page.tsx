import { CalendarWindow } from '@/components/windows/CalendarWindow';
import { TaskWindow } from '@/components/windows/TaskWindow';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Dashboard' });

export default function Dashboard() {
    return (
        <>
            <CalendarWindow display='today' />

            {/* TODO: maybe automate this divider between sections */}
            <div
                style={{
                    width: '1px',
                    backgroundColor: 'var(--dark)',
                }}
            />

            <TaskWindow />
        </>
    );
}
