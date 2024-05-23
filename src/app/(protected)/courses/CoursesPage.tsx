'use client';

import { AddButton } from '@/components/AddButton';
import { CourseCard, TermCard } from '@/components/cards';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import {
    CourseForm,
    TermForm,
    useCourseFormController,
    useTermFormController,
} from '@/components/forms';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import { Divider, Text } from '@chakra-ui/react';

export default function CoursesPage() {
    const [selectedTermId, setSelectedTermId] = useState<string>();

    const { data: terms, status: termStatus } = trpc.term.all.useQuery();
    const { mutate: removeTerm } = trpc.term.remove.useMutation();

    const { data: courses, status: courseStatus } =
        trpc.course.byTermId.useQuery(selectedTermId);
    const { mutate: removeCourse } = trpc.course.remove.useMutation();

    const termFormController = useTermFormController();
    const courseFormController = useCourseFormController();

    return (
        <>
            <Panel flex={2}>
                <PanelHeader>
                    <Text variant='h1'>Terms</Text>

                    <AddButton
                        onClick={termFormController.create}
                        aria-label='add term'
                    />
                </PanelHeader>

                <PanelBody
                    data={terms}
                    ifExists={(terms) =>
                        terms.map((term) => (
                            <TermCard
                                key={term.id}
                                term={term}
                                onEditClick={() =>
                                    termFormController.update(term)
                                }
                                onDeleteClick={() => {
                                    if (selectedTermId === term.id) {
                                        setSelectedTermId(undefined);
                                    }
                                    removeTerm(term.id);
                                }}
                                selected={term.id === selectedTermId}
                                onClick={() => setSelectedTermId(term.id)}
                            />
                        ))
                    }
                    ifUndefined={[
                        [
                            termStatus === 'error',
                            <Text align='center'>Error!</Text>,
                        ],
                        [
                            termStatus === 'pending',
                            <Text align='center'>Loading...</Text>,
                        ],
                        [
                            terms?.length == 0,
                            <Text align='center'>
                                No terms yet, add one with the button above!
                            </Text>,
                        ],
                    ]}
                />
            </Panel>

            <Divider
                orientation='vertical'
                borderColor='bg.800'
                opacity='100%'
            />

            <Panel flex={3}>
                <PanelHeader>
                    <Text variant='h1'>Courses</Text>

                    <AddButton
                        onClick={courseFormController.create}
                        isDisabled={selectedTermId === undefined}
                        aria-label='add course'
                    />
                </PanelHeader>

                <PanelBody
                    data={courses}
                    ifExists={(courses) =>
                        courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onEditClick={() =>
                                    courseFormController.update(course)
                                }
                                onDeleteClick={() => removeCourse(course.id)}
                            />
                        ))
                    }
                    ifUndefined={[
                        [
                            courseStatus === 'error',
                            <Text align='center'>Error!</Text>,
                        ],
                        [
                            courseStatus === 'pending',
                            <Text align='center'>Loading...</Text>,
                        ],
                        [
                            courses?.length === 0,
                            <Text align='center'>
                                Select a term and add courses to it with the
                                button above!
                            </Text>,
                        ],
                    ]}
                />
            </Panel>

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
