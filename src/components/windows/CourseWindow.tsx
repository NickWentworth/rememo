'use client';

import { CourseCard } from '../cards';
import { CourseForm } from '../forms';
import { CoursePayload } from '@/lib/types';
import { deleteCourse } from '@/lib/actions/courses';
import { useCourseData } from '../providers';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type CourseWindowProps = {
    selectedTermId: string;
};

export function CourseWindow(props: CourseWindowProps) {
    const { data: courses } = useCourseData();
    const courseFormState = useFormState<CoursePayload>();

    const selectedCourses = courses.filter(
        (c) => c.termId === props.selectedTermId
    );

    return (
        <>
            <div className={`${styles.window} ${styles.course}`}>
                <div className={styles.header}>
                    <div>
                        <h1>Courses</h1>

                        <button
                            className={styles.addButton}
                            onClick={courseFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>
                </div>

                <div className={styles.list}>
                    {selectedCourses.map((c) => (
                        <CourseCard
                            key={c.id}
                            course={c}
                            onEditClick={() => courseFormState.update(c)}
                            onDeleteClick={() => deleteCourse(c.id)}
                        />
                    ))}
                </div>
            </div>

            <CourseForm
                state={courseFormState.formState}
                onCloseClick={courseFormState.close}
            />
        </>
    );
}
