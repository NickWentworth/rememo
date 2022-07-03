import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from './pages.module.css'

export default function Custom404() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Page not found • Rememo</title>
            </Head>

            <div className={'fill'}>
                <div className={styles.custom404}>
                    <h1>This page does not exist</h1>

                    <hr />

                    <div className={styles.custom404Message}>
                        <p>The requested URL</p>
                        <p>{router.asPath}</p>
                        <p>could not be found</p>
                    </div>

                    <hr />

                    {/* TODO - return to dashboard once its created */}
                    <Link href='/tasks'>
                        <button>Back to Rememo</button>
                    </Link>
                </div>
            </div>
        </>
    )
}
