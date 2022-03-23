import { useState } from 'react';
import Sidebar from '../components/sidebar.js';
import { getAllTabNames, getAllTabData } from '../lib/tabs.js';
import styles from './[tab].module.css';

// tab components
import Dashboard from '../components/tabs/dashboard.js';
import Notes from '../components/tabs/notes.js';
import Tasks from '../components/tabs/tasks.js';

// TODO - probably have to add custom date with exact times being optional, only date required
// TEMP - just testing for now
let initialTasks = [
    { name: 'Homework A', class: 'Math', due: 'March 24, 2022 23:59', description: 'math book page 123', progress: 0},
    { name: 'Homework B', class: 'Science', due: 'March 27, 2022 12:00', description: 'lab 3 pdf on canvas', progress: 0},
    { name: 'Homework C', due: 'April 12, 2022 12:00:00', progress: 0}
]
// ----

export default function Tab({ tabData, currentTab }) {
    const [tasks, setTasks] = useState(initialTasks);
    
    // adds a task to the end of the array
    function addTask(newTask) {
        setTasks([...tasks, newTask]);
    }

    // removes a task at the given index
    function removeTask(index) {
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

    const taskFunctions = { add: addTask, remove: removeTask, edit: editTask }; // given to pages to interact with tasks

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
