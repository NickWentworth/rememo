import { useState, useEffect } from 'react';
import { TaskPanel } from './taskPanel';
import { TaskModifyForm } from './taskModifyForm';
import { emptyTask, getISO, getTimeDivider } from '../../lib/taskUtility';
import styles from './taskList.module.css';

// TODO - add class creation panel and a way to get a class's assigned color

// TEMP
const userID = 0;
// ----

// different modify modes for task modify form
export const taskModifyMode = {
    closed: 0,
    add: 1,
    edit: 2
}

const initialViewInfo = {
    mode: taskModifyMode.closed, // current view of modify form
    initialTask: emptyTask, // index in tasks array of task being edited
    index: -1 // task currently being edited before changes
}

export function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [viewInfo, setViewInfo] = useState(initialViewInfo);

    useEffect(() => {
        fetch(`/api/tasks/${userID}`)
            .then((res) => res.json())
            .then((tasks) => setTasks(tasks))
    }, [])

    // TODO - probably shouldn't send the entire list of tasks, only the part that needs updating
    // functions used by components to modify tasks list
    const taskFunctions = {
        add: (newTask) => {
            let updatedTasks = tasks.concat(newTask);
            setTasks(updatedTasks);

            fetch(`api/tasks/${userID}`, {
                method: 'POST',
                body: JSON.stringify({ tasks: updatedTasks })
            })
        },
        delete: (index) => {
            let updatedTasks = tasks.filter((task, i) => {
                return i != index;
            })
            setTasks(updatedTasks);

            fetch(`api/tasks/${userID}`, {
                method: 'POST',
                body: JSON.stringify({ tasks: updatedTasks })
            })

            if (index == viewInfo.index) {
                viewFunctions.close();
            }
        },
        edit: (newTask, index) => {
            let updatedTasks = tasks.map((task, i) => {
                return (i != index) ? task : newTask;
            })
            setTasks(updatedTasks);
            
            fetch(`api/tasks/${userID}`, {
                method: 'POST',
                body: JSON.stringify({ tasks: updatedTasks })
            })

            viewFunctions.close();
        }
    }

    // functions used by components to change view mode for modify form
    const viewFunctions = {
        close: () => {
            setViewInfo({ mode: taskModifyMode.closed, initialTask: emptyTask, index: -1 });
        },
        add: () => {
            setViewInfo({ mode: taskModifyMode.add, initialTask: emptyTask, index: -1 });
        },
        edit: (initialTask, index) => {
            setViewInfo({ mode: taskModifyMode.edit, initialTask, index});
        }
    }

    // called by form when submitting
    function collectTaskFormData(newTask) {
        switch (viewInfo.mode) {
            case taskModifyMode.add:
                taskFunctions.add(newTask);
                break;
            case taskModifyMode.edit:
                taskFunctions.edit(newTask, viewInfo.index);
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
                }).map((task, index) => {
                    // insert time dividers for organization
                    let dividerName = getTimeDivider(task);
                    let previousDividerName = getTimeDivider( (index == 0) ? '' : tasks[index - 1] ); // gets previous task's divider or blank for first task

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
                        focused={viewInfo.index == index}
                        editTask={viewFunctions.edit}
                        deleteTask={taskFunctions.delete}
                    />)

                    return elements;
                }).flat()}

                <h1 hidden={tasks.length != 0}>No tasks left!</h1>
            </div>

            <TaskModifyForm viewInfo={viewInfo} closeView={viewFunctions.close} collectData={collectTaskFormData} />
        </div>
    )
}
