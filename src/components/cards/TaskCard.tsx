'use client';

import { TaskPayload } from '@/lib/types';
import { Edit, Trash } from '../icons';
import { Subtask } from './Subtask';
import { formatTaskDate } from '@/lib/date';
import { setTaskCompletion } from '@/lib/actions/tasks';
import { useCourseData } from '../providers';
import { useState } from 'react';
import styles from './card.module.css';

const BANNER_ICON_SIZE = 20;

type TaskCardProps = {
    task: TaskPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
};

export function TaskCard(props: TaskCardProps) {
    // use course data to get referenced course's name and color
    const course = useCourseData().get(props.task.courseId ?? '');

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
                style={{ backgroundColor: course?.color }}
            >
                <button
                    className={styles.bannerButton}
                    onClick={props.onEditClick}
                >
                    <Edit
                        size={BANNER_ICON_SIZE}
                        color={hovering ? 'dark' : 'transparent'}
                    />
                </button>

                <button
                    className={styles.bannerButton}
                    onClick={props.onDeleteClick}
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

                        <h1 className={styles.headerTask}>{props.task.name}</h1>

                        <h3
                            className={styles.headerCourse}
                            style={{ color: course?.color }}
                        >
                            {course?.name}
                        </h3>
                    </div>

                    <p>{formatTaskDate(props.task.due)}</p>
                </div>

                {/* Subtasks */}
                {props.task.subtasks.length != 0 && <hr />}
                {props.task.subtasks.map((s) => (
                    <Subtask key={s.id} subtask={s} />
                ))}

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
