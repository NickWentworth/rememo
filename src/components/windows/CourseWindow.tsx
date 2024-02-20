'use client';

import { Plus } from '../icons';
import { CourseCard } from './cards';
import { CourseForm } from './forms';
import Button from '@/components/Button';
import { CoursePayload } from '@/lib/types';
import { deleteCourse } from '@/lib/actions/courses';
import { useCourseMutations, useCoursesByTermId } from '@/lib/query/courses';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type CourseWindowProps = {
    selectedTermId?: string;
};

export function CourseWindow(props: CourseWindowProps) {
    const { data: courses, status } = useCoursesByTermId(props.selectedTermId);
    const { remove: removeCourse } = useCourseMutations();

    const courseFormState = useFormState<CoursePayload>();

    const list = () => {
        if (status === 'error') {
            return <p>Error!</p>;
        }

        if (status === 'pending') {
            return <p>Loading...</p>;
        }

        // display message if there are no courses for the selected term
        if (courses.length == 0) {
            // TODO: show the selected term name if it exists
            return (
                <p>
                    Select a term and add courses to it with the button above!
                </p>
            );
        }

        // by default, return all selected courses mapped to a card component
        return courses.map((course) => (
            <CourseCard
                key={course.id}
                course={course}
                onEditClick={() => courseFormState.update(course)}
                onDeleteClick={() => removeCourse(course.id)}
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
