'use client';

import { TermWindow } from '@/components/windows/TermWindow';
import { CourseWindow } from '@/components/windows/CourseWindow';
import { useTermData } from '@/components/providers';
import { useState } from 'react';

export default function Courses() {
    // lifted state to store the selected term id
    const { data: terms } = useTermData();
    const [selectedTermId, setSelectedTermId] = useState(terms[0].id);

    return (
        <>
            <TermWindow
                selectedTermId={selectedTermId}
                onTermCardClick={setSelectedTermId}
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
