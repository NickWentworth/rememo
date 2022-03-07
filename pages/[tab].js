import Sidebar from '../components/sidebar.js';
import { getAllTabNames, getAllTabData } from '../lib/tabs.js';
import styles from './[tab].module.css';

// all tab components
import Dashboard from '../components/tabs/dashboard.js';
import Notes from '../components/tabs/notes.js';
import Tasks from '../components/tabs/tasks.js';
const tabNameToElement = {
    'dashboard': <Dashboard />,
    'notes': <Notes />,
    'tasks': <Tasks />
}

export default function Tab({ tabData, currentTab }) {
    return (
        <div className={styles.page}>
            <Sidebar tabData={tabData} currentTab={currentTab} />
            {tabNameToElement[currentTab]}
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
