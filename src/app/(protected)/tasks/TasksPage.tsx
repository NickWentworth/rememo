'use client';

import Button, { AddButton } from '@/components/Button';
import Panel from '@/components/Panel';
import SearchBar from '@/components/SearchBar';
import { TaskCard } from '@/components/cards';
import { TaskForm } from '@/components/forms';
import { TaskPayload } from '@/lib/types';
import { GetTaskOptions } from '@/lib/actions/tasks';
import { useTaskMutations, useTasksWithOptions } from '@/lib/query/tasks';
import { useFormState } from '@/lib/hooks/useFormState';
import { useState } from 'react';

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

    // TODO: fix styling for task header
    const header = [
        <div>
            <h1>Tasks</h1>
            <AddButton onClick={taskFormState.create} />
        </div>,
        <SearchBar
            onTypingStop={(term) =>
                setOptions((curr) => ({
                    ...curr,
                    search: term,
                }))
            }
            placeholder={`Search ${options.show} terms`}
        />,
        <div>
            <p>Showing</p>

            <select
                value={options.show}
                onChange={(e) =>
                    // TODO: implement better type checking here
                    setOptions((curr) => ({
                        ...curr,
                        show: e.target.value as GetTaskOptions['show'],
                    }))
                }
            >
                <option value='current'>Current</option>
                <option value='past'>Past</option>
            </select>

            <p>tasks</p>
        </div>,
    ];

    const list = (() => {
        if (status === 'error') {
            return <p>Error!</p>;
        }

        if (status === 'pending') {
            return <p>Loading...</p>;
        }

        // display message if there are no tasks
        if (tasks.length == 0) {
            if (options.search) {
                // filtering options are being used
                return <p>No tasks match the given filters</p>;
            } else {
                // no filters, just no tasks exist
                return <p>No tasks exist, create one with the button above!</p>;
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
                    <p>That's all!</p>
                )}
            </>
        );
    })();

    return (
        <>
            <Panel header={header} body={list} flex={1} align='center' />

            <TaskForm
                state={taskFormState.formState}
                onCloseClick={taskFormState.close}
            />
        </>
    );
}
