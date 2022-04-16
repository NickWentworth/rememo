import { useState } from 'react';
import Image from 'next/image';
import Sidebar from '../components/sidebar';
import TaskForm from '../components/forms/taskForm';
import { emptyTask, getISO, getTimeDivider, getFormattedDueString } from '../lib/taskUtility.js';
import styles from './tasks.module.css';

// TODO - move entire task list into components to simplify page and allow reuse for dashboard
// TODO - set scrollbar into the task list div, not outside next to manage task window

const iconSize = 30; // size of tab panel edit/remove buttons

// different tabs for task modify panel
const taskModifyMode = {
    closed: 0,
    add: 1,
    edit: 2
}

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [viewInfo, setViewInfo] = useState({
        mode: taskModifyMode.closed, // current view of manage task window
        taskIndex: -1, // index in tasks array of task being edited
        initialTask: emptyTask // task currently being edited before changes
    })

    let previousDividerName = ''; // used to detect changes in divider names for organizing
    
    // various functions used by components to modify tasks list
    const taskFunctions = {
        add: (newTask) => {
            setTasks([...tasks, newTask]);
        },
        delete: (index) => {
            setTasks(tasks.filter((task, i) => {
                return i != index;
            }))
        },
        edit: (newTask, index) => {
            setTasks(tasks.map((task, i) => {
                return (i != index) ? task : newTask;
            }))
        }
    }

    // called by form when submitting
    function getTaskFormData(task) {
        switch (viewInfo.mode) {
            case taskModifyMode.add:
                taskFunctions.add(task);
                break;
            case taskModifyMode.edit:
                taskFunctions.edit(task, viewInfo.taskIndex);
                break;
        }
    }

    return (
        <div className={styles.page}>
            <Sidebar currentTab='Tasks' />
            
            <div className={styles.taskList}>
                <button onClick={setViewInfo.bind(this, { mode: taskModifyMode.add, taskIndex: -1, initialTask: emptyTask })}>Add Task</button>

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
                        focused={viewInfo.taskIndex == index}
                        deleteTask={taskFunctions.delete}
                        setViewInfo={setViewInfo}
                    />)

                    return elements;
                }).flat()}
            </div>

            <div className={styles.taskModifyPanel + ' boxShadowDark'} hidden={viewInfo.mode == taskModifyMode.closed}>
                <div className={styles.closeButtonWrapper + ' interactableHighlight'}>
                    <Image
                        src='/images/icons/close.svg'
                        width={40}
                        height={40}
                        onClick={setViewInfo.bind(this, {
                            mode: taskModifyMode.closed,
                            taskIndex: -1,
                            initialTask: emptyTask
                        })}
                    />
                </div>
                
                <h1 hidden={viewInfo.mode != taskModifyMode.add}>Add Task</h1>
                <h1 hidden={viewInfo.mode != taskModifyMode.edit}>Edit Task</h1>

                <hr />

                <TaskForm fetch={getTaskFormData} initialTask={viewInfo.initialTask} />
            </div>
        </div>
    )
}

function TaskPanel({ task, index, focused, deleteTask, setViewInfo }) {
    const [showEditBar, setShowEditBar] = useState(false);

    let [formattedString, color] = getFormattedDueString(task);

    return (
        <div
            className={styles.taskPanel}
            style={{ border: focused ? '3px solid var(--white)' : '3px solid transparent' }}
            onMouseEnter={setShowEditBar.bind(this, true)}
            onMouseLeave={setShowEditBar.bind(this, false)}
        >
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
                    className={styles.editButton + ' interactable'}
                    src='/images/icons/edit.svg'
                    width={iconSize}
                    height={iconSize}
                    onClick={setViewInfo.bind(this, {
                        mode: taskModifyMode.edit,
                        taskIndex: index,
                        initialTask: task
                    })}
                />
                
                <Image
                    className={styles.deleteButton + ' interactable'}
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
