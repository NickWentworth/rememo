'use client';

import Panel, { Centered } from '@/components/Panel';
import Calendar from '@/components/Calendar';
import { TaskCard } from '@/components/cards';
import { TaskForm } from '@/components/forms';
import { useFormState } from '@/lib/hooks/useFormState';
import { useTaskMutations, useTasksWithOptions } from '@/lib/query/tasks';
import { TaskPayload } from '@/lib/types';
import Button from '@/components/Button';

export default function DashboardPage() {
    // only include tasks for this week
    const { tasks, query } = useTasksWithOptions({
        search: '',
        show: 'this week',
    });
    const { status, fetchNextPage, isFetchingNextPage, hasNextPage } = query;
    const { remove: removeTask } = useTaskMutations();

    const taskFormState = useFormState<TaskPayload>();

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
                        onEditClick={() => taskFormState.update(task)}
                        onDeleteClick={() => removeTask(task.id)}
                    />
                ))}

                {/* TODO: automatically fetch when scrolling down to the end of the list */}
                {/* as well as either a button to fetch more or a message if no more remain */}
                {hasNextPage ? (
                    <Button
                        type='outline'
                        onClick={fetchNextPage}
                        disabled={isFetchingNextPage}
                    >
                        {/* TODO: display how many more tasks are remaining to the user */}
                        Fetch More Tasks
                    </Button>
                ) : (
                    <Centered>That's all!</Centered>
                )}
            </>
        );

        return (
            <>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEditClick={() => taskFormState.update(task)}
                        onDeleteClick={() => removeTask(task.id)}
                    />
                ))}
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

            <Panel header={<h1>This Week's Tasks</h1>} body={list} flex={3} />

            <TaskForm
                state={taskFormState.formState}
                onCloseClick={taskFormState.close}
            />
        </>
    );
}
