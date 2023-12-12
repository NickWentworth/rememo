'use client';

import { CoursePayload, TermPayload } from '@/lib/types';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './page.module.css';
import { useCourseData, useTermData } from '@/components/providers';
import { TermCard } from '@/components/TaskCard/TermCard';
import { CourseCard } from '@/components/TaskCard/CourseCard';

export default function Courses() {
    const terms = useTermData().data;
    const courses = useCourseData().data;

    const termFormState = useFormState<TermPayload>();
    const courseFormState = useFormState<CoursePayload>();

    return (
        <>
            <div className={styles.page}>
                {/* terms header */}
                <div className={styles.header}>
                    <h1>Terms</h1>

                    <button
                        className={styles.addButton}
                        onClick={termFormState.create}
                    >
                        <h1>+</h1>
                    </button>
                </div>

                <div className={styles.header} />

                {/* courses header */}
                <div className={styles.header}>
                    <h1>Courses</h1>

                    <button
                        className={styles.addButton}
                        onClick={courseFormState.create}
                    >
                        <h1>+</h1>
                    </button>
                </div>

                {/* terms list */}
                <div className={styles.list}>
                    {terms.map((t) => (
                        <TermCard
                            key={t.id}
                            term={t}
                            onEditClick={() => termFormState.update(t)}
                            onDeleteClick={() =>
                                console.log(`TODO: delete ${t.name}`)
                            }
                        />
                    ))}
                </div>

                <div className={styles.vr} />

                {/* courses list */}
                <div className={styles.list}>
                    {courses.map((c) => (
                        <CourseCard
                            key={c.id}
                            course={c}
                            onEditClick={() => courseFormState.update(c)}
                            onDeleteClick={() =>
                                console.log(`TODO: delete ${c.name}`)
                            }
                        />
                    ))}
                </div>
            </div>

            {/* TODO: term form */}

            {/* TODO: course form */}
        </>
    );
}
