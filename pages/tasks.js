import { useState } from 'react';
import { useObjectList } from '../lib/hooks/useObjectList';
import Head from 'next/head';
import { Sidebar } from '../components/sidebar';
import { Loading } from '../components';
import { Task } from '../components/cards';
import { TaskForm } from '../components/forms';
import { SectionHeader } from '../components/SectionHeader';
import { getTaskTimeDivider } from '../lib/utility/date';
import styles from '../styles/pages.module.css';

export default function Tasks() {
    const [tasks, taskFunctions] = useObjectList('task');
    const [editingTask, setEditingTask] = useState(null);

    const [courses, courseFunctions] = useObjectList('course');

    // final array of tasks for displaying
    const displayTasks = tasks?.slice().sort((a, b) => {
        const aDate = new Date(`${a.dueDate}T${a.dueTime || '23:59'}:00`);
        const bDate = new Date(`${b.dueDate}T${b.dueTime || '23:59'}:00`);
        return aDate - bDate;
    }).flatMap((task, index, currentList) => {
        const divider = getTaskTimeDivider(task.dueDate, task.dueTime);
        const previous = currentList[index - 1];

        const dividerElement = <div key={divider} className={styles.divider}>
            <p>{divider}</p>
            <hr />
        </div>

        const taskElement = <Task
            key={task.id}
            task={task}
            onEditClick={() => setEditingTask(task)}
            onDeleteClick={() => taskFunctions.delete(task)}
            course={courses?.find((course) => task.courseId == course.id) || null}
        />

        const showDivider = (index == 0) || (divider !== getTaskTimeDivider(previous.dueDate, previous.dueTime));

        return showDivider
            ? [dividerElement, taskElement]
            : [taskElement]
    })
    
    return (
        <>
            <Head>
                <title>Tasks • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />

                {tasks == null || courses == null
                    ? <Loading />
                    : <>
                        <TaskForm
                            editingData={editingTask}
                            add={taskFunctions.add}
                            edit={taskFunctions.edit}
                            nullEditingData={() => setEditingTask(null)}
                            courses={courses}
                        />
                        
                        <div className={styles.content}>
                            <div className={styles.section}>
                                <SectionHeader title='Tasks' onAddClicked={() => setEditingTask({})} />

                                <div className={styles.list}>
                                    {displayTasks.length == 0
                                        ? <p>No remaining tasks</p>
                                        : displayTasks
                                    }
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}
