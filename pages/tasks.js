import { useState } from 'react';
import { useObjectList } from '../components/hooks/useObjectList';
import Head from 'next/head';
import Sidebar from '../components/sidebar';
import { Task } from '../components/cards';
import { TaskForm } from '../components/forms/TaskForm';
import { SectionHeader } from '../components/SectionHeader';
import styles from './pages.module.css';

export default function Tasks() {
    const [tasks, taskFunctions] = useObjectList('task');
    const [editingTask, setEditingTask] = useState(null);

    const [courses, courseFunctions] = useObjectList('course');

    // TODO - add loading component
    if (tasks == null || courses == null) {
        return 'Loading...'
    }

    return (
        <>
            <Head>
                <title>Tasks • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />

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

                        {tasks.length == 0
                            ? <p>No remaining tasks</p>
                            : tasks.map((task) => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    onEditClick={() => setEditingTask(task)}
                                    onDeleteClick={() => taskFunctions.delete(task)}
                                    course={courses.find((course) => task.courseId == course.id)}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
