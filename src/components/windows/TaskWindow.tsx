'use client';

import { Plus } from '../icons';
import { TaskCard } from './cards';
import { TaskForm } from './forms';
import Button from '@/components/Button';
import { TaskPayload } from '@/lib/types';
import { nowUTC } from '@/lib/date';
import { useAllTasks, useTaskMutations } from '@/lib/query/tasks';
import { useFormState } from '@/lib/hooks/useFormState';
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
    const { data: tasks, status } = useAllTasks();
    const { remove: removeTask } = useTaskMutations();

    const taskFormState = useFormState<TaskPayload>();

    // TODO: re-implement filters and search term through backend options

    // TODO: store active filters in local storage or in the database
    // store active filters by their indices in the const filters array
    // const [filterIndices, setFilterIndices] = useState<number[]>([]);

    // store a search term to further filter tasks
    // const [searchTerm, setSearchTerm] = useState('');

    // const filteredTasks = tasks.filter((task) => {
    //     // filter tasks by function
    //     const filterMatch =
    //         filterIndices.length == 0 ||
    //         filterIndices.some((idx) => FILTERS[idx].fn(task));

    //     // TODO: add course filter dropdown and filter by that instead
    //     // search task name, description, subtask names, and course name for user-given search term
    //     const courseName = getCourse(task.courseId ?? '')?.name ?? '';
    //     const searchMatch = search(searchTerm, [
    //         task.name,
    //         task.description,
    //         ...task.subtasks.map((s) => s.name),
    //         courseName,
    //     ]);

    //     return filterMatch && searchMatch;
    // });

    // function toggleFilter(idx: number) {
    //     setFilterIndices((indices) =>
    //         indices.includes(idx)
    //             ? indices.filter((i) => i != idx)
    //             : [...indices, idx]
    //     );
    // }

    const list = () => {
        if (status === 'error') {
            return <p>Error!</p>;
        }

        if (status === 'pending') {
            return <p>Loading...</p>;
        }

        // display message if there are no tasks
        if (tasks.length == 0) {
            return <p>No tasks yet, create one with the button above!</p>;
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
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>Tasks</h1>

                        <Button
                            type='solid'
                            onClick={taskFormState.create}
                            icon={<Plus size={20} color='dark' />}
                            border='round'
                        />
                    </div>

                    {/* <div className={styles.filters}>
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
                    </div> */}
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
