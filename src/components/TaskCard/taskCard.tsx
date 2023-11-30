'use client';

import { Task } from '@prisma/client';
import { Edit, Trash } from '../icons';
import { formatTaskDate } from '@/lib/date';
import {
    deleteTask,
    setTaskCompletion,
    testModifyTask,
} from '@/lib/actions/tasks';
import { useState } from 'react';
import styles from './card.module.css';

// TEMP
const COURSE_COLOR = '#EF7E7E';
// ----

const BANNER_ICON_SIZE = 20;

type TaskCardProps = {
    task: Task;
};

export function TaskCard(props: TaskCardProps) {
    // is the mouse currently hovering over the task card?
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className={styles.card}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div
                className={styles.banner}
                style={{ backgroundColor: COURSE_COLOR }}
            >
                <button
                    className={styles.bannerButton}
                    // TODO: open up task form to edit a task
                    onClick={() => testModifyTask(props.task.id)}
                >
                    <Edit
                        size={BANNER_ICON_SIZE}
                        color={hovering ? 'dark' : 'transparent'}
                    />
                </button>

                <button
                    className={styles.bannerButton}
                    onClick={() => {
                        // TODO: add custom confirmation popup component
                        let confirmation = window.confirm(
                            `Are you sure you want to delete this task?\nname: ${props.task.name}\nid: ${props.task.id}`
                        );

                        if (confirmation) {
                            deleteTask(props.task.id);
                        }
                    }}
                >
                    <Trash
                        size={BANNER_ICON_SIZE}
                        color={hovering ? 'dark' : 'transparent'}
                    />
                </button>
            </div>

            <div className={styles.body}>
                {/* Header */}
                <div>
                    <div className={styles.headerTitle}>
                        {/* TODO: style checkbox */}
                        <input
                            type='checkbox'
                            checked={props.task.completed}
                            onChange={() =>
                                setTaskCompletion(
                                    props.task.id,
                                    !props.task.completed
                                )
                            }
                            readOnly
                        />

                        <h3 className={styles.headerTask}>{props.task.name}</h3>

                        <h4
                            className={styles.headerCourse}
                            style={{ color: COURSE_COLOR }}
                        >
                            {props.task.course}
                        </h4>
                    </div>

                    <p>{formatTaskDate(props.task.due)}</p>
                </div>

                {/* TODO: Subtasks */}

                {/* Description */}
                {props.task.description && (
                    <>
                        <hr />
                        <p>{props.task.description}</p>
                    </>
                )}
            </div>
        </div>
    );
}
