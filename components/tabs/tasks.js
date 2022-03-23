import { getFormattedDueDateString } from '../../lib/utility.js';
import styles from './tasks.module.css';

export default function Tasks({ tasks, taskFunctions }) {
    return (
        <div className={styles.tasks}>
            <button onClick={taskFunctions.add.bind(this, { name: 'New homework', due: 'March 23 2022', class: 'Chinese' })}>add task</button>
            <button onClick={taskFunctions.remove.bind(this, tasks.length-1)}>remove task</button>
            <button onClick={taskFunctions.edit.bind(this, tasks.length-1, { name: 'Changed homework', due: 'March 24 2022', class: 'Chinese' })}>change task</button>

            {tasks.map((task, index) => <TaskPanel key={index} task={task} index={index} />)}
        </div>
    )
}

function TaskPanel({ task, index }) {
    return (
        <div className={styles.taskPanel}>
            <div className={styles.taskHeader}>
                <h3>{index} - {task.name}</h3>
                <h4>{task.class}</h4>
            </div>

            <p>&nbsp;&nbsp;&nbsp;&nbsp;{getFormattedDueDateString(task.due)}</p>

            {task.description && <hr />}
            
            <p>{task.description}</p>
        </div>
    )
}
