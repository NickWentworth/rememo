'use client';

import { Search } from '@/components/icons';
import { Task } from '@prisma/client';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/forms/TaskForm';
import { deleteTask } from '@/lib/actions/tasks';
import { useFormState } from '@/lib/hooks/useFormState';
import { useTaskData } from '@/components/providers';
import { CSSProperties } from 'react';
import styles from './page.module.css';

export default function Tasks() {
    const { data: tasks } = useTaskData();

    const {
        formState,
        close: setTaskFormClose,
        create: setTaskFormCreate,
        update: setTaskFormUpdate,
    } = useFormState<Task>();

    return (
        <>
            <div className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.count}>
                        <h1>Tasks</h1>

                        <h1 className={styles.numberFill}>{tasks.length}</h1>

                        {/* TODO: plus sign is slightly off-center, either fix or add new svg */}
                        <button
                            className={styles.addButton}
                            onClick={setTaskFormCreate}
                        >
                            <h1>+</h1>
                        </button>
                    </div>

                    <div className={styles.filters}>
                        <FilterButton name='Overdue' count={0} active={false} />
                        <FilterButton
                            name='This Week'
                            count={0}
                            active={true}
                        />
                        <FilterButton
                            name='Next Week'
                            count={0}
                            active={false}
                        />
                    </div>

                    <div className={styles.search}>
                        <div className={styles.searchBox}>
                            <p>Search</p>
                            <Search size={16} color='light' />
                        </div>
                    </div>
                </div>

                <div className={styles.list}>
                    {tasks.map((t) => (
                        <TaskCard
                            key={t.id}
                            task={t}
                            onEditClick={() => setTaskFormUpdate(t)}
                            onDeleteClick={() => deleteTask(t.id)}
                        />
                    ))}
                </div>
            </div>

            <TaskForm state={formState} onCloseClick={setTaskFormClose} />
        </>
    );
}

type FilterButtonProps = {
    name: string;
    count: number;
    active: boolean;
};

function FilterButton(props: FilterButtonProps) {
    const activeBarStyle = {
        backgroundColor: props.active ? 'var(--accent)' : 'var(--light)',
        height: props.active ? '4px' : '2px',
        marginTop: props.active ? '2px' : '4px',
    } satisfies CSSProperties;

    const activeNumberStyle = {
        backgroundColor: props.active ? 'var(--accent)' : '',
        color: props.active ? 'var(--dark)' : '',
        fontWeight: props.active ? '500' : '',
    } satisfies CSSProperties;

    return (
        <div className={styles.filterButton}>
            <p style={{ fontWeight: props.active ? '500' : '' }}>
                {props.name}
            </p>

            <h4 className={`${styles.numberFill}`} style={activeNumberStyle}>
                {props.count}
            </h4>

            <div
                className={styles.filterButtonActiveBar}
                style={activeBarStyle}
            />
        </div>
    );
}
