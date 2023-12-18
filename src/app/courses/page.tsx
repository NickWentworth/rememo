'use client';

import { CoursePayload, TermPayload } from '@/lib/types';
import { TermCard, CourseCard } from '@/components/cards';
import { TermForm, CourseForm } from '@/components/forms';
import { deleteCourse } from '@/lib/actions/courses';
import { deleteTerm } from '@/lib/actions/terms';
import { useFormState } from '@/lib/hooks/useFormState';
import { useCourseData, useTermData } from '@/components/providers';
import { useState } from 'react';

import pageStyles from '@/app/page.module.css';
import styles from './courses.module.css';

export default function Courses() {
    const terms = useTermData().data;
    const courses = useCourseData().data;

    // only show courses for the selected term
    const [selectedTermId, setSelectedTermId] = useState(terms[0].id);

    const termFormState = useFormState<TermPayload>();
    const courseFormState = useFormState<CoursePayload>();

    return (
        <>
            <div className={`${pageStyles.page} ${styles.page}`}>
                {/* terms header */}
                <div className={pageStyles.header}>
                    <div className={pageStyles.headerSection}>
                        <h1>Terms</h1>

                        <button
                            className={pageStyles.addButton}
                            onClick={termFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>
                </div>

                <div className={pageStyles.header} />

                {/* courses header */}
                <div className={pageStyles.header}>
                    <div className={pageStyles.headerSection}>
                        <h1>Courses</h1>

                        <button
                            className={pageStyles.addButton}
                            onClick={courseFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>
                </div>

                {/* terms list */}
                <div className={pageStyles.cardList}>
                    {terms.map((t) => (
                        <TermCard
                            key={t.id}
                            term={t}
                            onEditClick={() => termFormState.update(t)}
                            onDeleteClick={() => deleteTerm(t.id)}
                            selected={selectedTermId === t.id}
                            onClick={() => setSelectedTermId(t.id)}
                        />
                    ))}
                </div>

                <div className={styles.vr} />

                {/* courses list */}
                <div className={pageStyles.cardList}>
                    {courses
                        .filter((c) => c.termId === selectedTermId)
                        .map((c) => (
                            <CourseCard
                                key={c.id}
                                course={c}
                                onEditClick={() => courseFormState.update(c)}
                                onDeleteClick={() => deleteCourse(c.id)}
                            />
                        ))}
                </div>
            </div>

            <TermForm
                state={termFormState.formState}
                onCloseClick={termFormState.close}
            />

            <CourseForm
                state={courseFormState.formState}
                onCloseClick={courseFormState.close}
            />
        </>
    );
}
