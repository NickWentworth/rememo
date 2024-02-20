import { Subtask } from '@prisma/client';
import styles from './card.module.css';
import { formatTaskDate } from '@/lib/date';
import { useTaskMutations } from '@/lib/query/tasks';

type SubtaskRowProps = {
    subtask: Subtask;
};

export function Subtask(props: SubtaskRowProps) {
    const { setSubtaskCompletion } = useTaskMutations();

    return (
        <div className={styles.subtask}>
            <input
                type='checkbox'
                checked={props.subtask.completed}
                onChange={() =>
                    setSubtaskCompletion({
                        id: props.subtask.id,
                        completed: !props.subtask.completed,
                    })
                }
            />

            <h3>{props.subtask.name}</h3>

            <p className={styles.subtaskDue}>
                {formatTaskDate(props.subtask.due)}
            </p>
        </div>
    );
}
