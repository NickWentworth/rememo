'use client';

import { Edit, Trash } from '../icons';
import Button from '@/components/Button';
import { Subtask } from './Subtask';
import { BUTTON_ICON_SIZE } from '.';
import { TaskPayload } from '@/lib/types';
import { formatTaskDate } from '@/lib/date';
import { setTaskCompletion } from '@/lib/actions/tasks';
import { useCourses } from '@/providers';
import { useState } from 'react';
import styles from './card.module.css';

type TaskCardProps = {
    task: TaskPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
};

export function TaskCard(props: TaskCardProps) {
    // use course data to get referenced course's name and color
    const course = useCourses().get(props.task.courseId ?? '');

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
                <Button
                    type='transparent'
                    onClick={props.onEditClick}
                    icon={
                        <Edit
                            size={BUTTON_ICON_SIZE}
                            color={hovering ? 'dark' : 'transparent'}
                        />
                    }
                    usualPadding
                    border='square'
                />

                <Button
                    type='transparent'
                    onClick={props.onDeleteClick}
                    icon={
                        <Trash
                            size={BUTTON_ICON_SIZE}
                            color={hovering ? 'dark' : 'transparent'}
                        />
                    }
                    usualPadding
                    border='square'
                />
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
