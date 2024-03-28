'use client';

import { AddButton } from '@/components/Button';
import Panel, { Centered } from '@/components/Panel';
import { CourseCard, TermCard } from '@/components/cards';
import {
    CourseForm,
    TermForm,
    useCourseFormController,
    useTermFormController,
} from '@/components/forms';
import { useCourseMutations, useCoursesByTermId } from '@/lib/query/courses';
import { useAllTerms, useTermMutations } from '@/lib/query/terms';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';

export default function CoursesPage() {
    // terms
    const [selectedTermId, setSelectedTermId] = useState<string>();

    const { data: terms, status: termStatus } = trpc.term.all.useQuery();
    const { remove: removeTerm } = useTermMutations();

    const termFormController = useTermFormController();

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
                        onEditClick={() => termFormController.update(term)}
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

    const courseFormController = useCourseFormController();

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
                        onEditClick={() => courseFormController.update(course)}
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
                        <AddButton onClick={termFormController.create} />
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
                            onClick={courseFormController.create}
                            disabled={selectedTermId === undefined}
                        />
                    </>
                }
                body={courseList}
                flex={3}
            />

            <TermForm controller={termFormController} />

            {selectedTermId && (
                <CourseForm
                    controller={courseFormController}
                    selectedTermId={selectedTermId}
                />
            )}
        </>
    );
}
