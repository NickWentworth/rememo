import { Task } from '@prisma/client';
import { formatTaskDate } from '@/lib/date';
import styles from './card.module.css';

// TEMP
const COURSE_COLOR = '#EF7E7E';
// ----

type TaskCardProps = {
    task: Task;
};

export function TaskCard(props: TaskCardProps) {
    return (
        <div className={styles.card}>
            <div
                className={styles.banner}
                style={{ backgroundColor: COURSE_COLOR }}
            />

            <div className={styles.body}>
                {/* Header */}
                <div>
                    <div className={styles.headerTitle}>
                        {/* TODO: style checkbox */}
                        <input
                            type='checkbox'
                            checked={props.task.completed}
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
