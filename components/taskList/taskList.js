import { useState, useEffect } from 'react';
import { TaskPanel } from './taskPanel';
import { TaskModifyForm } from './taskModifyForm';
import { emptyTask, getISO, getTimeDivider } from '../../lib/taskUtility';
import styles from './taskList.module.css';

// TODO - add class creation panel and a way to get a class's assigned color

// TEMP - until storing userId on login is implemented
const userId = 'cl2gq2clv0097p8ur47v57qxs';
// ----

// different modify modes for task modify form
export const taskModifyMode = {
    closed: 0,
    add: 1,
    edit: 2
}

const initialViewInfo = {
    mode: taskModifyMode.closed, // current view of modify form
    focusedTask: emptyTask, // task currently focused, used for editing
}

export function TaskList() {
    const [tasks, setTasks] = useState(null);
    const [viewInfo, setViewInfo] = useState(initialViewInfo);

    // on page load, fetch tasks from database
    useEffect(async () => {
        let response = await fetch(`/api/tasks/${userId}`);
        let data = await response.json();
        setTasks(data.tasks);
    }, [])

    // functions used by components to modify tasks list
    const taskFunctions = {
        add: async (addedTask) => {
            let response = await fetch(`api/tasks/add`, {
                method: 'POST',
                body: JSON.stringify({
                    task: { ...addedTask, userId: userId },
                })
            })
            let data = await response.json();
            
            setTasks(tasks.concat(data.task));
        },
        delete: async (deletedTask) => {
            let response = await fetch(`api/tasks/delete`, {
                method: 'POST',
                body: JSON.stringify({
                    task: { ...deletedTask, userId: userId },
                })
            })
            let data = await response.json();

            // ensure successful task deletion
            if (data.task) {
                setTasks(tasks.filter((task) => task.id != deletedTask.id));

                if (deletedTask.id == viewInfo.focusedTask.id) {
                    viewFunctions.close();
                }
            }
        },
        edit: async (editedTask) => {
            let response = await fetch(`api/tasks/edit`, {
                method: 'POST',
                body: JSON.stringify({
                    task: { ...editedTask, userId: userId },
                })
            })
            let data = await response.json();

            setTasks(tasks.map((task) => {
                return (task.id == editedTask.id) ? data.task : task;
            }))

            viewFunctions.close();
        }
    }

    // functions used by components to change view mode for modify form
    const viewFunctions = {
        close: () => {
            setViewInfo({ mode: taskModifyMode.closed, focusedTask: emptyTask });
        },
        add: () => {
            setViewInfo({ mode: taskModifyMode.add, focusedTask: emptyTask });
        },
        edit: (focusedTask) => {
            setViewInfo({ mode: taskModifyMode.edit, focusedTask: focusedTask });
        }
    }

    // called by form when submitting
    function collectTaskFormData(task) {
        switch (viewInfo.mode) {
            case taskModifyMode.add:
                taskFunctions.add(task);
                break;
            case taskModifyMode.edit:
                taskFunctions.edit(task);
                break;
        }
    }

    // TODO - make loading component
    if (!tasks) return <p>Loading...</p>

    return (
        <div className={styles.taskList}>
            <div className={styles.taskPanels}>
                <button onClick={viewFunctions.add}>Add Task</button>

                {tasks.sort((aTask, bTask) => {
                    // sort tasks by due date, earliest first
                    let aDate = new Date(getISO(aTask));
                    let bDate = new Date(getISO(bTask));
                    return aDate - bDate;
                }).flatMap((task, index) => {
                    // insert time dividers for organization
                    let elements = []; // eventually contains output elements
                    
                    let dividerName = getTimeDivider(task);

                    // check for new divider
                    if (index == 0 || dividerName != getTimeDivider(tasks[index - 1])) {
                        elements.push(<div key={dividerName} className={styles.timeDivider}>
                            <h1>{dividerName}</h1>
                            <hr />
                        </div>)
                    }

                    elements.push(<TaskPanel
                        key={task.id}
                        task={task}
                        focused={task.id === viewInfo.focusedTask.id}
                        editTask={viewFunctions.edit}
                        deleteTask={taskFunctions.delete}
                        setProgress={(amount) => taskFunctions.edit({ ...task, progress: amount })}
                    />)

                    return elements;
                })}

                <h1 hidden={tasks.length != 0}>No tasks left!</h1>
            </div>

            <TaskModifyForm viewInfo={viewInfo} closeView={viewFunctions.close} collectData={collectTaskFormData} />
        </div>
    )
}
