'use client';

import { CalendarWindow } from '@/components/windows/CalendarWindow';
import { TaskWindow } from '@/components/windows/TaskWindow';

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
