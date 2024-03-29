import { Subtask } from '@prisma/client';
import { formatTaskDate } from '@/lib/date';
import { buildClass } from '@/lib/utils';
import { trpc } from '@/lib/trpc/client';
import styles from './card.module.css';

type SubtaskRowProps = {
    subtask: Subtask;
};

export function Subtask(props: SubtaskRowProps) {
    const { mutate: setSubtaskCompletion } =
        trpc.task.setSubtaskCompletion.useMutation();

    const dueFormat = formatTaskDate(
        props.subtask.due,
        props.subtask.completed
    );

    const containerClass = buildClass(
        styles.subtask,
        props.subtask.completed && styles.completed
    );

    const textClass = buildClass(styles.subtaskDue, styles[dueFormat.status]);

    return (
        <div className={containerClass}>
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

            <p className={textClass}>{dueFormat.str}</p>
        </div>
    );
}
