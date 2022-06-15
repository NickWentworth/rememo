import Head from 'next/head';
import Sidebar from '../components/sidebar';
import TaskList from '../components/taskList';

export default function Tasks() {
    return (
        <>
            <Head>
                <title>Tasks • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                <TaskList />
            </div>
        </>
    )
}
