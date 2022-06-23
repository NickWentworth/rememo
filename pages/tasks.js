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

    // TODO - add loading component
    if (tasks == null) {
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
                />
                
                <div className={styles.content}>
                    <div className={styles.section}>
                        <SectionHeader title='Tasks' onAddClicked={() => setEditingTask({})} />

                        {tasks.map((task) => <p key={task.id}>{JSON.stringify(task)}</p>)}
                    </div>
                </div>
            </div>
        </>
    )
}
