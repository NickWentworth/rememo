'use client';

import { Plus } from '../icons';
import { TaskCard } from './cards';
import { TaskForm } from './forms';
import Button from '@/components/Button';
import SearchBar from '@/components/SearchBar';
import { TaskPayload } from '@/lib/types';
import { useTaskMutations, useTasksWithOptions } from '@/lib/query/tasks';
import { useFormState } from '@/lib/hooks/useFormState';
import { useState } from 'react';
import { GetTaskOptions } from '@/lib/actions/tasks';
import styles from './window.module.css';

export function TaskWindow() {
    // store a options to further filter tasks
    const [options, setOptions] = useState<GetTaskOptions>({
        search: '',
        show: 'current',
    });

    const { data: tasks, status } = useTasksWithOptions(options);
    const { remove: removeTask } = useTaskMutations();

    const taskFormState = useFormState<TaskPayload>();

    const list = () => {
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

        // by default, return all tasks mapped to a card component
        return tasks.map((t) => (
            <TaskCard
                key={t.id}
                task={t}
                onEditClick={() => taskFormState.update(t)}
                onDeleteClick={() => removeTask(t.id)}
            />
        ));
    };

    return (
        <>
            <div className={`${styles.window} ${styles.task}`}>
                <div className={`${styles.header} ${styles.task}`}>
                    <div className={styles.title}>
                        <h1>Tasks</h1>

                        <Button
                            type='solid'
                            onClick={taskFormState.create}
                            icon={<Plus size={20} color='dark' />}
                            border='round'
                        />
                    </div>

                    <SearchBar
                        onTypingStop={(term) => {
                            setOptions((curr) => ({ ...curr, search: term }));
                        }}
                        placeholder={`Search ${options.show} tasks`}
                    />

                    <div className={styles.taskShowing}>
                        <p>Showing</p>

                        <select
                            value={options.show}
                            onChange={(e) =>
                                // TODO: implement better type checking here
                                setOptions((curr) => ({
                                    ...curr,
                                    show: e.target
                                        .value as GetTaskOptions['show'],
                                }))
                            }
                        >
                            <option value='current'>Current</option>
                            <option value='past'>Past</option>
                        </select>

                        <p>tasks</p>
                    </div>
                </div>

                <div className={`${styles.list} ${styles.task}`}>{list()}</div>
            </div>

            <TaskForm
                state={taskFormState.formState}
                onCloseClick={taskFormState.close}
            />
        </>
    );
}
