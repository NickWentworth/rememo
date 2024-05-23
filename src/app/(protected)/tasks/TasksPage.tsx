'use client';

import { AddButton } from '@/components/AddButton';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import SearchBar from '@/components/SearchBar';
import TypedSelect from '@/components/TypedSelect';
import { TaskCard } from '@/components/cards';
import { TaskForm, useTaskFormController } from '@/components/forms';
import { type GetTaskOptions } from '@/lib/trpc/task';
import { trpc, usePaginatedTasks } from '@/lib/trpc/client';
import { useState } from 'react';
import { Button, Flex, Grid, Text } from '@chakra-ui/react';

export default function TasksPage() {
    // store options to filter tasks
    const [options, setOptions] = useState<GetTaskOptions>({
        search: '',
        show: 'current',
    });

    const { tasks, query } = usePaginatedTasks(options);
    const { status, fetchNextPage, isFetchingNextPage, hasNextPage } = query;
    const { mutate: removeTask } = trpc.task.remove.useMutation();

    const taskFormController = useTaskFormController();

    return (
        <>
            <Panel flex={1}>
                <PanelHeader>
                    <Grid
                        flex='1'
                        templateColumns='1fr 300px 1fr'
                        alignItems='center'
                    >
                        <Flex gap='0.5rem'>
                            <Text variant='h1'>Tasks</Text>
                            <AddButton
                                onClick={taskFormController.create}
                                aria-label='add task'
                            />
                        </Flex>

                        <SearchBar
                            onTypingStop={(term) =>
                                setOptions((curr) => ({
                                    ...curr,
                                    search: term,
                                }))
                            }
                            placeholder={`Search ${options.show} terms`}
                        />

                        <Flex gap='0.25rem' align='baseline' justify='end'>
                            <Text variant='h4'>Showing</Text>

                            <TypedSelect<GetTaskOptions['show']>
                                options={[
                                    { value: 'current', display: 'Current' },
                                    { value: 'past', display: 'Past' },
                                ]}
                                onChange={(show) =>
                                    setOptions((curr) => ({
                                        ...curr,
                                        show,
                                    }))
                                }
                            />

                            <Text variant='h4'>tasks</Text>
                        </Flex>
                    </Grid>
                </PanelHeader>

                <PanelBody
                    maxW='800px'
                    data={tasks}
                    ifExists={(tasks) => (
                        <>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onEditClick={() =>
                                        taskFormController.update(task)
                                    }
                                    onDeleteClick={() => removeTask(task.id)}
                                />
                            ))}

                            {hasNextPage ? (
                                <Button
                                    alignSelf='center'
                                    onClick={() => fetchNextPage()}
                                    isLoading={isFetchingNextPage}
                                >
                                    Fetch More Tasks
                                </Button>
                            ) : (
                                <Text align='center'>
                                    No more remaining tasks
                                </Text>
                            )}
                        </>
                    )}
                    ifUndefined={[
                        [
                            status === 'error',
                            <Text align='center'>Error!</Text>,
                        ],
                        [
                            status === 'pending',
                            <Text align='center'>Loading...</Text>,
                        ],
                        [
                            tasks?.length === 0 && options.search === '',
                            <Text align='center'>
                                No tasks match the given filters
                            </Text>,
                        ],
                        [
                            tasks?.length === 0 && options.search !== '',
                            <Text align='center'>
                                No tasks exist, create one with the button
                                above!
                            </Text>,
                        ],
                    ]}
                />
            </Panel>

            <TaskForm controller={taskFormController} />
        </>
    );
}
