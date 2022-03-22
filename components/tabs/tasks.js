import { getFormattedDueDateString } from '../../lib/utility.js';
import styles from './tasks.module.css';

export default function Tasks({ tasks }) {
    return (
        <div className={styles.tasks}>
            {tasks.map((task) => <TaskPanel task={task} />)}
        </div>
    )
}

function TaskPanel({ task }) {
    return (
        <div className={styles.taskPanel}>
            <div className={styles.taskHeader}>
                <h3>{task.name}</h3>
                <h4>{task.class}</h4>
            </div>

            <p>&nbsp;&nbsp;&nbsp;&nbsp;{getFormattedDueDateString(task.due)}</p>

            {task.description && <hr />}
            
            <p>{task.description}</p>
        </div>
    )
}
