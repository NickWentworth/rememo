import { Subtask } from '@prisma/client';
import styles from './card.module.css';
import { formatTaskDate } from '@/lib/date';
import { setSubtaskCompletion } from '@/lib/actions/tasks';

type SubtaskRowProps = {
    subtask: Subtask;
};

export function Subtask(props: SubtaskRowProps) {
    return (
        <div className={styles.subtask}>
            <input
                type='checkbox'
                checked={props.subtask.completed}
                onChange={() =>
                    setSubtaskCompletion(
                        props.subtask.id,
                        !props.subtask.completed
                    )
                }
            />

            <h3>{props.subtask.name}</h3>

            <p className={styles.subtaskDue}>
                {formatTaskDate(props.subtask.due)}
            </p>
        </div>
    );
}
