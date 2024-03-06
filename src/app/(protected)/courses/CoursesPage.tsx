'use client';

import { AddButton } from '@/components/Button';
import Panel, { Centered } from '@/components/Panel';
import { CourseCard, TermCard } from '@/components/cards';
import { CourseForm, TermForm } from '@/components/forms';
import { useFormState } from '@/lib/hooks/useFormState';
import { useCourseMutations, useCoursesByTermId } from '@/lib/query/courses';
import { useAllTerms, useTermMutations } from '@/lib/query/terms';
import { CoursePayload, TermPayload } from '@/lib/types';
import { useState } from 'react';

export default function CoursesPage() {
    // terms
    const [selectedTermId, setSelectedTermId] = useState<string>();

    const { data: terms, status: termStatus } = useAllTerms();
    const { remove: removeTerm } = useTermMutations();

    const termFormState = useFormState<TermPayload>();

    const termList = (() => {
        if (termStatus === 'error') {
            return <Centered>Error!</Centered>;
        }

        if (termStatus === 'pending') {
            return <Centered>Loading...</Centered>;
        }

        // display message if no terms exist
        if (terms.length == 0) {
            return (
                <Centered>
                    No terms yet, add one with the button above!
                </Centered>
            );
        }

        // by default, return all terms mapped to a card component
        return (
            <>
                {terms.map((term) => (
                    <TermCard
                        key={term.id}
                        term={term}
                        onEditClick={() => termFormState.update(term)}
                        onDeleteClick={() => {
                            if (selectedTermId === term.id) {
                                setSelectedTermId(undefined);
                            }
                            removeTerm(term.id);
                        }}
                        selected={term.id === selectedTermId}
                        onClick={() => setSelectedTermId(term.id)}
                    />
                ))}
            </>
        );
    })();

    // courses
    const { data: courses, status: courseStatus } =
        useCoursesByTermId(selectedTermId);
    const { remove: removeCourse } = useCourseMutations();

    const courseFormState = useFormState<CoursePayload>();

    const courseList = (() => {
        if (courseStatus === 'error') {
            return <Centered>Error!</Centered>;
        }

        if (courseStatus === 'pending') {
            return <Centered>Loading...</Centered>;
        }

        // display message if there are no courses for the selected term
        if (courses.length == 0) {
            // TODO: show the selected term name if it exists
            return (
                <Centered>
                    Select a term and add courses to it with the button above!
                </Centered>
            );
        }

        // by default, return all selected courses mapped to a card component
        return (
            <>
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onEditClick={() => courseFormState.update(course)}
                        onDeleteClick={() => removeCourse(course.id)}
                    />
                ))}
            </>
        );
    })();

    return (
        <>
            <Panel
                header={
                    <>
                        <h1>Terms</h1>
                        <AddButton onClick={termFormState.create} />
                    </>
                }
                body={termList}
                flex={2}
            />

            <Panel
                header={
                    <>
                        <h1>Courses</h1>
                        <AddButton
                            onClick={courseFormState.create}
                            disabled={selectedTermId === undefined}
                        />
                    </>
                }
                body={courseList}
                flex={3}
            />

            <TermForm
                state={termFormState.formState}
                onCloseClick={termFormState.close}
            />

            {selectedTermId && (
                <CourseForm
                    state={courseFormState.formState}
                    onCloseClick={courseFormState.close}
                    selectedTermId={selectedTermId}
                />
            )}
        </>
    );
}
