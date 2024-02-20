'use client';

import { CourseWindow, TermWindow } from '@/components/windows';
import { useState } from 'react';

export default function CoursesPage() {
    // lifted state to store the selected term id
    const [selectedTermId, setSelectedTermId] = useState<string | undefined>(
        undefined
    );

    return (
        <>
            <TermWindow
                selectedTermId={selectedTermId}
                setSelectedTermId={setSelectedTermId}
            />

            {/* TODO: maybe automate this divider between sections */}
            <div
                style={{
                    width: '1px',
                    backgroundColor: 'var(--dark)',
                }}
            />

            <CourseWindow selectedTermId={selectedTermId} />
        </>
    );
}
