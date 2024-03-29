'use client';

import Button, { AddButton } from '@/components/Button';
import Panel, { Centered } from '@/components/Panel';
import Calendar from '@/components/Calendar';
import { TaskCard } from '@/components/cards';
import { TaskForm, useTaskFormController } from '@/components/forms';
import { trpc, usePaginatedTasks } from '@/lib/trpc/client';

export default function DashboardPage() {
    // only include tasks for this week
    const { tasks, query } = usePaginatedTasks({
        search: '',
        show: 'this week',
    });
    const { status, fetchNextPage, isFetchingNextPage, hasNextPage } = query;
    const { mutate: removeTask } = trpc.task.remove.useMutation();

    // TODO: no add button here, is there a need for a task form?
    const taskFormController = useTaskFormController();

    // TODO: make (inifinite) list component that will handle these common states
    const list = (() => {
        if (status === 'error') {
            return <Centered>Error!</Centered>;
        }

        if (status === 'pending') {
            return <Centered>Loading...</Centered>;
        }

        if (tasks.length === 0) {
            return (
                <Centered>
                    No tasks due this week, create one with the button above!
                </Centered>
            );
        }

        return (
            <>
                {/* return all tasks mapped to a card component */}
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEditClick={() => taskFormController.update(task)}
                        onDeleteClick={() => removeTask(task.id)}
                    />
                ))}

                {/* as well as either a button to fetch more or a message if no more remain */}
                <Centered>
                    {/* TODO: automatically fetch when scrolling down to the end of the list */}
                    {hasNextPage ? (
                        <Button
                            type='outline'
                            onClick={fetchNextPage}
                            disabled={isFetchingNextPage}
                        >
                            {/* Fetch More Tasks ({remainingTasks} remaining) */}
                            Fetch More Tasks
                        </Button>
                    ) : (
                        'No more remaining tasks this week'
                    )}
                </Centered>
            </>
        );
    })();

    return (
        <>
            <Panel
                header={<h1>Daily Calendar</h1>}
                body={<Calendar display='day' initialTime={7} />}
                flex={2}
            />

            <Panel
                header={
                    <>
                        <h1>This Week's Tasks</h1>{' '}
                        <AddButton onClick={taskFormController.create} />
                    </>
                }
                body={list}
                flex={3}
            />

            <TaskForm controller={taskFormController} />
        </>
    );
}
