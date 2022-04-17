import { useState } from 'react';
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

// TODO - add database and interact with database (prisma)
const initialTasks = [
    { name: 'Homework A', class: 'Math', color: '#54C6EB', description: '.........', dueDate: '2022-04-17', dueTime: '23:59', progress: 0 },
    { name: 'Homework B', class: 'Science', color: '#06D6A0', description: '.........', dueDate: '2022-04-21', dueTime: '23:59', progress: 0 },
    { name: 'Homework C', class: 'English', color: '#F39237', description: '.........', dueDate: '2022-04-23', dueTime: '', progress: 0 }
]

const initialViewInfo = {
    mode: taskModifyMode.closed, // current view of modify form
    initialTask: emptyTask, // index in tasks array of task being edited
    index: -1 // task currently being edited before changes
}

export function TaskList() {
    const [tasks, setTasks] = useState(initialTasks);
    const [viewInfo, setViewInfo] = useState(initialViewInfo);

    // functions used by components to modify tasks list
    const taskFunctions = {
        add: (newTask) => {
            setTasks([...tasks, newTask]);
        },
        delete: (index) => {
            setTasks(tasks.filter((task, i) => {
                return i != index;
            }))

            if (index == viewInfo.index) {
                viewFunctions.close();
            }
        },
        edit: (newTask, index) => {
            setTasks(tasks.map((task, i) => {
                return (i != index) ? task : newTask;
            }))

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
