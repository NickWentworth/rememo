import Head from 'next/head';
import Sidebar from '../components/sidebar';

export default function Index() {
    return (
        <>
            <Head>
                <title>Index • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                <p>Index Page</p>
            </div>
        </>
    )
}
