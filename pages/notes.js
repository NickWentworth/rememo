import Head from 'next/head';
import Sidebar from '../components/sidebar';

export default function Notes() {
    return (
        <>
            <Head>
                <title>Notes - Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                <p>Notes</p>
            </div>
        </>
    )
}
