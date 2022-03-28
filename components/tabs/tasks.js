import { useState } from 'react';
import Image from 'next/image';
import TaskForm from '../forms/taskForm.js';
import { emptyTask, getFormattedDueDateString } from '../../lib/taskUtility.js';
import { interactable } from '../../lib/styleClasses.js';
import styles from './tasks.module.css';

const iconSize = 30;

export default function Tasks({ tasks, taskFunctions }) {
    const [currentViewInfo, setCurrentViewInfo] = useState({
        showForm: false, // show task form
        addingTask: false, // true if currently adding task, false if editing
        editTaskIndex: -1, // index in tasks array of task being edited
        initialTask: emptyTask // task currently being edited before changes
    })

    function getTask(task) {
        if (currentViewInfo.addingTask) {
            taskFunctions.addTask(task);
        } else {
            taskFunctions.editTask(currentViewInfo.editTaskIndex, task);
        }
    }

    return (
            <div className={styles.content}>
                <div className={styles.taskList}>
                    <div className={styles.taskTabHeader}>
                        <button
                            className={styles.addButton}
                            onClick={setCurrentViewInfo.bind(this, {
                                showForm: true,
                                addingTask: true,
                                editTaskIndex: -1,
                                initialTask: emptyTask
                            })}
                        >
                            Add Task
                        </button>
                    </div>

                    {tasks.sort((a, b) => {
                        let dateA = a.dueDate + (a.dueTime ? ('T' + a.dueTime) : '');
                        let dateB = b.dueDate + (b.dueTime ? ('T' + b.dueTime) : '');
                        return Date.parse(dateA) - Date.parse(dateB);
                    }).map((task, index) => <TaskPanel
                        key={index}
                        task={task}
                        index={index}
                        deleteTask={taskFunctions.deleteTask}
                        currentViewInfo={currentViewInfo}
                        setCurrentViewInfo={setCurrentViewInfo}
                    />)}
                </div>
                    
                <div className={styles.taskManage} hidden={!currentViewInfo.showForm}>
                    <div className={styles.closeButton}>
                        <Image
                            className={interactable}
                            src='/images/icons/close.svg'
                            width={40}
                            height={40}
                            onClick={setCurrentViewInfo.bind(this, {
                                showForm: false,
                                addingTask: false,
                                editTaskIndex: -1,
                                initialTask: emptyTask
                            })}
                        />
                    </div>
                    
                    <h1>{currentViewInfo.addingTask ? 'Add Task' : 'Edit Task'}</h1>

                    <hr />

                    <TaskForm
                        getTask={getTask}
                        initialTask={currentViewInfo.initialTask}
                    />
                </div>
            </div>
    )
}

function TaskPanel({ task, index, deleteTask, currentViewInfo, setCurrentViewInfo }) {
    const [showEditBar, setShowEditBar] = useState(false);

    return (
        <div
            className={styles.taskPanel}
            style={{
                border: (index == currentViewInfo.editTaskIndex) ? '3px solid var(--white)' : 'none',
                margin: (index == currentViewInfo.editTaskIndex) ? '0px' : '3px'
            }}
            onMouseEnter={setShowEditBar.bind(this, true)}
            onMouseLeave={setShowEditBar.bind(this, false)
        }>
            <div className={styles.taskPanelBody} style={{ borderRadius: showEditBar ? '10px 0px 0px 10px' : '10px' }}>
                <div className={styles.taskPanelHeader}>
                    <h2>{task.name}</h2>
                    <h4>{task.class}</h4>
                </div>

                <p>&nbsp;&nbsp;&nbsp;&nbsp;{getFormattedDueDateString(task)}</p>

                <hr hidden={!task.description} />
                
                <p>{task.description}</p>
            </div>

            <div className={styles.taskEditBar} style={{ opacity: (showEditBar || index == currentViewInfo.editTaskIndex) ? '100%' : '0%' }}>
                <Image
                    className={styles.editButton + interactable}
                    src='/images/icons/edit.svg'
                    width={iconSize}
                    height={iconSize}
                    onClick={setCurrentViewInfo.bind(this, {
                        showForm: true,
                        addingTask: false,
                        editTaskIndex: index,
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
