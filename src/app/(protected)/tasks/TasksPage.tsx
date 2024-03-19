'use client';

import Button, { AddButton } from '@/components/Button';
import Panel, { Centered } from '@/components/Panel';
import SearchBar from '@/components/SearchBar';
import TypedSelect from '@/components/forms/TypedSelect';
import { TaskCard } from '@/components/cards';
import { TaskForm } from '@/components/forms';
import { TaskPayload } from '@/lib/types';
import { GetTaskOptions } from '@/lib/actions/tasks';
import { useTaskMutations, useTasksWithOptions } from '@/lib/query/tasks';
import { useFormState } from '@/lib/hooks/useFormState';
import { useState } from 'react';
import styles from './tasks.module.css';

export default function TasksPage() {
    // store options to filter tasks
    const [options, setOptions] = useState<GetTaskOptions>({
        search: '',
        show: 'current',
    });

    const { tasks, query } = useTasksWithOptions(options);
    const { status, fetchNextPage, isFetchingNextPage, hasNextPage } = query;
    const { remove: removeTask } = useTaskMutations();

    const taskFormState = useFormState<TaskPayload>();

    const header = (
        <div className={styles.header}>
            <div className={styles.title}>
                <h1>Tasks</h1>
                <AddButton onClick={taskFormState.create} />
            </div>

            <SearchBar
                onTypingStop={(term) =>
                    setOptions((curr) => ({
                        ...curr,
                        search: term,
                    }))
                }
                placeholder={`Search ${options.show} terms`}
            />

            <div className={styles.showing}>
                <p>Showing</p>

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

                <p>tasks</p>
            </div>
        </div>
    );

    const list = (() => {
        if (status === 'error') {
            return <Centered>Error!</Centered>;
        }

        if (status === 'pending') {
            return <Centered>Loading...</Centered>;
        }

        // display message if there are no tasks
        if (tasks.length == 0) {
            if (options.search) {
                // filtering options are being used
                return <Centered>No tasks match the given filters</Centered>;
            } else {
                // no filters, just no tasks exist
                return (
                    <Centered>
                        No tasks exist, create one with the button above!
                    </Centered>
                );
            }
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

                {/* as well as either a button to fetch more or a message if no more remain */}
                <Centered>
                    {/* TODO: automatically fetch when scrolling down to the end of the list */}
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
                        "That's all!"
                    )}
                </Centered>
            </>
        );
    })();

    return (
        <>
            <Panel header={header} body={list} flex={1} width={800} />

            <TaskForm
                state={taskFormState.formState}
                onCloseClick={taskFormState.close}
            />
        </>
    );
}
