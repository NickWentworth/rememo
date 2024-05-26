'use client';

import { AddButton } from '@/components/AddButton';
import { DailyCalendar } from '@/components/Calendar';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import { TaskCard } from '@/components/cards';
import { TaskForm, useTaskFormController } from '@/components/forms';
import { trpc, usePaginatedTasks } from '@/lib/trpc/client';
import { Button, Divider, Text } from '@chakra-ui/react';

export default function DashboardPage() {
    // only include tasks for this week
    const { tasks, query } = usePaginatedTasks({
        search: '',
        show: 'this week',
    });
    const { status, fetchNextPage, isFetchingNextPage, hasNextPage } = query;
    const { mutate: removeTask } = trpc.task.remove.useMutation();

    const taskFormController = useTaskFormController();

    return (
        <>
            <Panel flex={2}>
                <PanelHeader>
                    <Text variant='h1'>Daily Calendar</Text>
                </PanelHeader>

                <PanelBody>
                    <DailyCalendar initialTime={7} />
                </PanelBody>
            </Panel>

            <Divider
                orientation='vertical'
                borderColor='bg.800'
                opacity='100%'
            />

            <Panel flex={3}>
                <PanelHeader>
                    <Text variant='h1'>This Week's Tasks</Text>

                    <AddButton
                        onClick={taskFormController.create}
                        aria-label='add term'
                    />
                </PanelHeader>

                <PanelBody
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
                            tasks?.length === 0,
                            <Text align='center'>
                                No tasks due this week, create one with the
                                button above!
                            </Text>,
                        ],
                    ]}
                />
            </Panel>

            <TaskForm controller={taskFormController} />
        </>
    );
}
