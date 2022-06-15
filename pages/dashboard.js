import Head from 'next/head';
import Sidebar from '../components/sidebar';

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Dashboard - Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                <p>Dashboard</p>
            </div>
        </>
    )
}
