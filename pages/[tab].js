import Sidebar from '../components/sidebar.js';
import { getAllTabNames, getAllTabData } from '../lib/tabs.js';
import styles from './[tab].module.css';

// tab components
import Dashboard from '../components/tabs/dashboard.js';
import Notes from '../components/tabs/notes.js';
import Tasks from '../components/tabs/tasks.js';

export default function Tab({ tabData, currentTab, tasks }) {
    return (
        <div className={styles.page}>
            <Sidebar tabData={tabData} currentTab={currentTab} />
            
            {currentTab == 'dashboard' && <Dashboard />}
            {currentTab == 'notes' && <Notes />}
            {currentTab == 'tasks' && <Tasks tasks={tasks} />}
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

    // TODO - probably have to add custom date with exact times being optional, only date required
    // TEMP - just testing for now
    let tasks = [
        { name: 'Homework A', class: 'Math', due: 'March 24, 2022 23:59', description: 'math book page 123', progress: 0},
        { name: 'Homework B', class: 'Science', due: 'March 27, 2022 12:00', description: 'lab 3 pdf on canvas', progress: 0},
        { name: 'Homework C', due: 'April 12, 2022 12:00:00', progress: 0}
    ]
    // ----

    return {
        props: {
            tabData,
            currentTab: params.tab,
            tasks
        }
    }
}
