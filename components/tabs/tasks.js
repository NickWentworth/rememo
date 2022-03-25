import { useState } from 'react';
import { getFormattedDueDateString } from '../../lib/utility.js';
import styles from './tasks.module.css';

const iconSize = 30;

export default function Tasks({ tasks, taskFunctions }) {
    return (
        <div className={styles.tasks}>
            <button onClick={taskFunctions.add.bind(this, { name: 'New homework', due: 'March 23 2022', class: 'Chinese' })}>add task</button>

            {tasks.map((task, index) => <TaskPanel
                key={index}
                task={task} 
                index={index} 
                taskFunctions={taskFunctions}
            />)}
        </div>
    )
}

function TaskPanel({ task, index, taskFunctions }) {
    const [showEditBar, setShowEditBar] = useState(false);

    return (
        <div className={styles.taskPanel} onMouseEnter={setShowEditBar.bind(this, true)} onMouseLeave={setShowEditBar.bind(this, false)}>
            <div className={styles.taskPanelBody} style={{ borderRadius: showEditBar ? '10px 0px 0px 10px' : '10px' }}>
                    <div className={styles.taskPanelHeader}>
                        <h3>{index} - {task.name}</h3>
                        <h4>{task.class}</h4>
                    </div>

                    <p>&nbsp;&nbsp;&nbsp;&nbsp;{getFormattedDueDateString(task.due)}</p>

                    {task.description && <hr />}
                    
                    <p>{task.description}</p>
            </div>

            <div className={styles.taskEditBar} style={{ opacity: showEditBar ? '100%' : '0%' }}>
                <input
                    className={styles.editButton}
                    type='image'
                    src='/images/icons/edit.svg'
                    width={iconSize}
                    height={iconSize} 
                    // TODO -- add edit task window
                    onClick={() => alert('Editing Task ' + index)} 
                />
                <input
                    className={styles.deleteButton}
                    type='image'
                    src='/images/icons/delete.svg'
                    width={iconSize}
                    height={iconSize} 
                    onClick={taskFunctions.delete.bind(this, index)} 
                />
            </div>
        </div>
    )
}
