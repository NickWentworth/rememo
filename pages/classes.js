import Head from 'next/head';
import Sidebar from '../components/sidebar';

export default function Classes() {
    return (
        <>
            <Head>
                <title>Classes • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                <p>Classes</p>
            </div>
        </>
    )
}
