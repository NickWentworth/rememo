'use client';

import { Plus } from '../icons';
import { CourseCard } from './cards';
import { CourseForm } from './forms';
import Button from '@/components/Button';
import { CoursePayload } from '@/lib/types';
import { deleteCourse } from '@/lib/actions/courses';
import { useCourses, useTerms } from '@/providers';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type CourseWindowProps = {
    selectedTermId?: string;
};

export function CourseWindow(props: CourseWindowProps) {
    const { data: courses } = useCourses();
    const { data: terms } = useTerms();

    const courseFormState = useFormState<CoursePayload>();

    const selectedCourses = courses.filter(
        (c) => c.termId === props.selectedTermId
    );

    const list = () => {
        // if no selected term id, there are no terms that exist
        if (props.selectedTermId === undefined) {
            return <p>Create a term and select it to add courses to it!</p>;
        }

        // display message if there are no courses for the selected term
        if (selectedCourses.length == 0) {
            const selectedTermName = terms.find(
                (t) => props.selectedTermId === t.id
            )?.name;

            return (
                <p>
                    The selected term <b>{selectedTermName}</b> has no courses,
                    add one with the button above!
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

                        <Button
                            type='solid'
                            onClick={courseFormState.create}
                            icon={<Plus size={20} color='dark' />}
                            border='round'
                            // disable addition of courses if no term is focused, as courses need to be linked to terms
                            disabled={props.selectedTermId === undefined}
                        />
                    </div>
                </div>

                <div className={styles.list}>{list()}</div>
            </div>

            {props.selectedTermId && (
                <CourseForm
                    state={courseFormState.formState}
                    onCloseClick={courseFormState.close}
                    selectedTermId={props.selectedTermId}
                />
            )}
        </>
    );
}
