'use client';

import { Edit, Trash } from '@/components/icons';
import Button from '@/components/Button';
import { TaskCardSubtask } from './TaskCardSubtask';
import { BUTTON_ICON_SIZE } from '.';
import { TaskPayload } from '@/lib/types';
import { formatTaskDate } from '@/lib/date';
import { buildClass } from '@/lib/utils';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import styles from './card.module.css';

type TaskCardProps = {
    task: TaskPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
};

export function TaskCard(props: TaskCardProps) {
    const { mutate: setTaskCompletion } =
        trpc.task.setTaskCompletion.useMutation();

    // is the mouse currently hovering over the task card?
    const [hovering, setHovering] = useState(false);

    const dueFormat = formatTaskDate(props.task.due, props.task.completed);

    const cardClass = buildClass(
        styles.card,
        props.task.completed && styles.completed
    );

    return (
        <div
            className={cardClass}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div
                className={styles.banner}
                style={{ backgroundColor: props.task.course?.color }}
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
                                setTaskCompletion({
                                    id: props.task.id,
                                    completed: !props.task.completed,
                                })
                            }
                            readOnly
                        />

                        <h1 className={styles.headerTask}>{props.task.name}</h1>

                        <h3
                            className={styles.headerCourse}
                            style={{ color: props.task.course?.color }}
                        >
                            {props.task.course?.name}
                        </h3>
                    </div>

                    <p className={styles[dueFormat.status]}>{dueFormat.str}</p>
                </div>

                {/* Subtasks */}
                {props.task.subtasks.length != 0 && <hr />}
                {props.task.subtasks.map((s) => (
                    <TaskCardSubtask key={s.id} subtask={s} />
                ))}

                {/* Description */}
                {props.task.description && (
                    <>
                        <hr />
                        <p className={styles.taskDescription}>
                            {props.task.description}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
