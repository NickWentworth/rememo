'use client';

import { TaskCard } from '../cards';
import { TaskForm } from '../forms';
import { FilterButton } from '../FilterButton';
import { TaskPayload } from '@/lib/types';
import { deleteTask } from '@/lib/actions/tasks';
import { nowUTC } from '@/lib/date';
import { useTaskData } from '../providers';
import { useFormState } from '@/lib/hooks/useFormState';
import { useState } from 'react';
import styles from './window.module.css';

type Filter = {
    name: string;
    fn: (t: TaskPayload) => boolean;
};

const FILTERS = [
    {
        name: 'Overdue',
        fn: (t) => t.due < nowUTC(),
    },
    {
        name: 'On Time',
        fn: (t) => t.due > nowUTC(),
    },
] satisfies Filter[];

export function TaskWindow() {
    const { data: tasks } = useTaskData();
    const taskFormState = useFormState<TaskPayload>();

    // TODO: store active filters in local storage or in the database
    // store active filters by their indices in the const filters array
    const [filterIndices, setFilterIndices] = useState<number[]>([]);

    // store a search term to further filter tasks
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = tasks.filter((task) => {
        const filterMatch =
            filterIndices.length == 0 ||
            filterIndices.some((idx) => FILTERS[idx].fn(task));

        // TODO: search by more than just name, include description, course name, etc.
        const searchMatch =
            searchTerm === '' ||
            task.name.toLowerCase().includes(searchTerm.toLowerCase());

        return filterMatch && searchMatch;
    });

    function toggleFilter(idx: number) {
        setFilterIndices((indices) =>
            indices.includes(idx)
                ? indices.filter((i) => i != idx)
                : [...indices, idx]
        );
    }

    const list = () => {
        // display message if there are no tasks in general
        if (tasks.length == 0) {
            return <p>No tasks yet, create one with the button above!</p>;
        }

        // display message if there are tasks, but none match the filters
        if (filteredTasks.length == 0) {
            return <p>No tasks match the given filters</p>;
        }

        // by default, return all filtered tasks mapped to a card component
        return filteredTasks.map((t) => (
            <TaskCard
                key={t.id}
                task={t}
                onEditClick={() => taskFormState.update(t)}
                onDeleteClick={() => deleteTask(t.id)}
            />
        ));
    };

    return (
        <>
            <div className={`${styles.window} ${styles.task}`}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>Tasks</h1>

                        <button
                            className={styles.addButton}
                            onClick={taskFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>

                    <div className={styles.filters}>
                        {FILTERS.map((filter, idx) => (
                            <FilterButton
                                key={idx}
                                active={filterIndices.includes(idx)}
                                name={filter.name}
                                count={tasks.filter((t) => filter.fn(t)).length}
                                onClick={() => toggleFilter(idx)}
                            />
                        ))}
                    </div>

                    <div className={styles.search}>
                        {/* TODO: fix layout shift when this appears */}
                        <p hidden={searchTerm === ''}>
                            {filteredTasks.length} Match
                            {filteredTasks.length != 1 ? 'es' : ''}
                        </p>

                        <input
                            type='text'
                            className={styles.searchBar}
                            placeholder='Search'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
