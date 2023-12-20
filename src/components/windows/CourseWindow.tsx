'use client';

import { CourseCard } from '../cards';
import { CourseForm } from '../forms';
import { CoursePayload } from '@/lib/types';
import { deleteCourse } from '@/lib/actions/courses';
import { useCourseData, useTermData } from '../providers';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type CourseWindowProps = {
    selectedTermId?: string;
};

export function CourseWindow(props: CourseWindowProps) {
    const { data: courses } = useCourseData();
    const { data: terms } = useTermData();

    const courseFormState = useFormState<CoursePayload>();

    const selectedCourses = courses.filter(
        (c) => c.termId === props.selectedTermId
    );

    const list = () => {
        // if no selected term id, there are no terms that exist
        if (props.selectedTermId === undefined) {
            return (
                <p>No terms exist, create one first to add courses to it!</p>
            );
        }

        // display message if there are no courses for the selected term
        if (selectedCourses.length == 0) {
            const term = terms.find((t) => props.selectedTermId === t.id)?.name;

            return (
                <p>
                    The selected term <b>{term}</b> has no courses, add one with
                    the button above!
                </p>
            );
        }

        // by default, return all selected courses mapped to a card component
        return selectedCourses.map((c) => (
            <CourseCard
                key={c.id}
                course={c}
                onEditClick={() => courseFormState.update(c)}
                onDeleteClick={() => deleteCourse(c.id)}
            />
        ));
    };

    return (
        <>
            <div className={`${styles.window} ${styles.course}`}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>Courses</h1>

                        <button
                            className={styles.addButton}
                            onClick={courseFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>
                </div>

                <div className={styles.list}>{list()}</div>
            </div>

            <CourseForm
                state={courseFormState.formState}
                onCloseClick={courseFormState.close}
            />
        </>
    );
}
