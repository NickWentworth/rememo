import { useState } from 'react';
import { useObjectList } from '../hooks/useObjectList';
import { TaskPanel } from './taskPanel';
import { TaskModifyForm } from './taskModifyForm';
import { emptyTask, getISO, getTimeDivider } from '../../lib/taskUtility';
import styles from './taskList.module.css';

// TODO - add class creation panel and a way to get a class's assigned color

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
    const [tasks, baseTaskFunctions] = useObjectList('task');
    const [viewInfo, setViewInfo] = useState(initialViewInfo);

    // need to close task modify form on delete and edit
    const taskFunctions = {
        add: async (addedTask) => {
            await baseTaskFunctions.add(addedTask);
        },
        delete: async (deletedTask) => {
            await baseTaskFunctions.delete(deletedTask);
            
            if (deletedTask.id == viewInfo.focusedTask.id) {
                viewFunctions.close();
            }
        },
        edit: async (editedTask) => {
            await baseTaskFunctions.edit(editedTask);

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
