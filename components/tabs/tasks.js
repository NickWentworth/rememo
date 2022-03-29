import { useState } from 'react';
import Image from 'next/image';
import TaskForm from '../forms/taskForm.js';
import { emptyTask, getISO, getTimeDivider, getFormattedDueString } from '../../lib/taskUtility.js';
import { interactable } from '../../lib/styleClasses.js';
import styles from './tasks.module.css';

const iconSize = 30;

const taskModifyMode = {
    closed: 0,
    add: 1,
    edit: 2
}

export default function Tasks({ tasks, taskFunctions }) {
    const [currentViewInfo, setCurrentViewInfo] = useState({
        mode: taskModifyMode.closed, // current view of manage task window
        taskIndex: -1, // index in tasks array of task being edited
        initialTask: emptyTask // task currently being edited before changes
    })

    let previousDividerName = ''; // used for keeping track of when to insert a new time divider

    function getTask(task) {
        switch (currentViewInfo.mode) {
            case taskModifyMode.add:
                taskFunctions.addTask(task);
                break;
            case taskModifyMode.edit:
                taskFunctions.editTask(currentViewInfo.taskIndex, task);
                break;
        }
    }

    return (
            <div className={styles.content}>
                <div className={styles.taskList}>
                    <div className={styles.taskTabHeader}>
                        <button
                            className={styles.addButton}
                            onClick={setCurrentViewInfo.bind(this, {
                                mode: taskModifyMode.add,
                                taskIndex: -1,
                                initialTask: emptyTask
                            })}
                        >
                            Add Task
                        </button>
                    </div>

                    {tasks.sort((aTask, bTask) => {
                        // sort tasks by due date, earliest first
                        let aDate = new Date(getISO(aTask));
                        let bDate = new Date(getISO(bTask));
                        return aDate - bDate;
                    }).map((task, index) => {
                        // insert time dividers for organization
                        let dividerName = getTimeDivider(task);

                        let elements = []; // eventually contains output elements

                        // check for new divider
                        if (dividerName != previousDividerName) {
                            elements.push(<div key={dividerName} className={styles.timeDivider}>
                                <h1>{dividerName}</h1>
                                <hr />
                            </div>)

                            previousDividerName = dividerName;
                        }

                        elements.push(<TaskPanel
                            key={index}
                            task={task}
                            index={index}
                            focused={currentViewInfo.taskIndex == index}
                            deleteTask={taskFunctions.deleteTask}
                            setCurrentViewInfo={setCurrentViewInfo}
                        />)

                        return elements;
                    }).flat()}
                </div>
                    
                <div className={styles.taskManage} hidden={currentViewInfo.mode == taskModifyMode.closed}>
                    <div className={styles.closeButton}>
                        <Image
                            className={interactable}
                            src='/images/icons/close.svg'
                            width={40}
                            height={40}
                            onClick={setCurrentViewInfo.bind(this, {
                                mode: taskModifyMode.closed,
                                taskIndex: -1,
                                initialTask: emptyTask
                            })}
                        />
                    </div>
                    
                    <h1 hidden={currentViewInfo.mode != taskModifyMode.add}>Add Task</h1>
                    <h1 hidden={currentViewInfo.mode != taskModifyMode.edit}>Edit Task</h1>

                    <hr />

                    <TaskForm
                        getTask={getTask}
                        initialTask={currentViewInfo.initialTask}
                    />
                </div>
            </div>
    )
}

function TaskPanel({ task, index, focused, deleteTask, setCurrentViewInfo }) {
    const [showEditBar, setShowEditBar] = useState(false);

    let [formattedString, color] = getFormattedDueString(task);

    return (
        <div
            className={styles.taskPanel}
            style={{
                border: focused ? '3px solid var(--white)' : 'none',
                margin: focused ? '0px' : '3px'
            }}
            onMouseEnter={setShowEditBar.bind(this, true)}
            onMouseLeave={setShowEditBar.bind(this, false)
        }>
            <div className={styles.taskPanelBody} style={{ borderRadius: showEditBar ? '10px 0px 0px 10px' : '10px' }}>
                <div className={styles.taskPanelHeader}>
                    <h2>{task.name}</h2>
                    <h4>{task.class}</h4>
                </div>

                <p style={{ color }}>&nbsp;&nbsp;&nbsp;&nbsp;{formattedString}</p>

                <hr hidden={!task.description} />
                
                <p>{task.description}</p>
            </div>

            <div className={styles.taskEditBar} style={{ opacity: (showEditBar || focused) ? '100%' : '0%' }}>
                <Image
                    className={styles.editButton + interactable}
                    src='/images/icons/edit.svg'
                    width={iconSize}
                    height={iconSize}
                    onClick={setCurrentViewInfo.bind(this, {
                        mode: taskModifyMode.edit,
                        taskIndex: index,
                        initialTask: task
                    })}
                />
                
                <Image
                    className={styles.deleteButton + interactable}
                    src='/images/icons/delete.svg'
                    width={iconSize}
                    height={iconSize} 
                    // TODO - add 'are you sure?' popup
                    onClick={deleteTask.bind(this, index)} 
                />
            </div>
        </div>
    )
}
