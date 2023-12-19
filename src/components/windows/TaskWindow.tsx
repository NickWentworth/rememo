'use client';

import { Search } from '../icons';
import { TaskCard } from '../cards';
import { TaskForm } from '../forms';
import { TaskPayload } from '@/lib/types';
import { deleteTask } from '@/lib/actions/tasks';
import { useTaskData } from '../providers';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

export function TaskWindow() {
    const { data: tasks } = useTaskData();
    const taskFormState = useFormState<TaskPayload>();

    return (
        <>
            <div className={`${styles.window} ${styles.task}`}>
                <div className={styles.header}>
                    <div>
                        <h1>Tasks</h1>

                        <button
                            className={styles.addButton}
                            onClick={taskFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>

                    <div className={styles.filters}>
                        <p>===filters===</p>
                    </div>

                    <div className={styles.searchBar}>
                        <p>Search</p>
                        <Search size={16} color='white' />
                    </div>
                </div>

                <div className={`${styles.list} ${styles.task}`}>
                    {tasks.map((t) => (
                        <TaskCard
                            key={t.id}
                            task={t}
                            onEditClick={() => taskFormState.update(t)}
                            onDeleteClick={() => deleteTask(t.id)}
                        />
                    ))}
                </div>
            </div>

            <TaskForm
                state={taskFormState.formState}
                onCloseClick={taskFormState.close}
            />
        </>
    );
}
