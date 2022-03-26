import { useState } from 'react';
import Sidebar from '../components/sidebar.js';
import { getAllTabNames, getAllTabData } from '../lib/tabs.js';
import styles from './[tab].module.css';

// tab components
import Dashboard from '../components/tabs/dashboard.js';
import Notes from '../components/tabs/notes.js';
import Tasks from '../components/tabs/tasks.js';

export default function Tab({ tabData, currentTab }) {
    const [tasks, setTasks] = useState([]);
    
    // adds a task to the end of the array
    function addTask(newTask) {
        setTasks([...tasks, newTask]);
    }

    // deletes a task at the given index
    function deleteTask(index) {
        setTasks(tasks.filter((task, i) => {
            return index != i;
        }))
    }

    // edits the task at the given index to the given new task
    function editTask(index, newTask) {
        setTasks(tasks.map((task, i) => {
            return (index != i) ? task : newTask;
        }))
    }

    const taskFunctions = { addTask, deleteTask, editTask }; // given to pages to interact with tasks

    return (
        <div className={styles.page}>
            <Sidebar tabData={tabData} currentTab={currentTab} />
            
            {currentTab == 'dashboard' && <Dashboard />}
            {currentTab == 'notes' && <Notes />}
            {currentTab == 'tasks' && <Tasks tasks={tasks} taskFunctions={taskFunctions} />}
        </div>
    )
}

export async function getStaticPaths() {
    let paths = getAllTabNames();
    
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    let tabData = getAllTabData();

    return {
        props: {
            tabData,
            currentTab: params.tab
        }
    }
}
