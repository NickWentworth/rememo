import { CalendarWindow, TaskWindow } from '@/components/windows';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({ title: 'Dashboard' });

export default function Dashboard() {
    return (
        <>
            <CalendarWindow display='day' />

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
