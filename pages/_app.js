import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { AuthHandler } from '../components/auth';
import '../styles/global.css';
import '../styles/classes.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <link rel='icon' href='/images/logos/rememoAccent.svg' />
            </Head>
            
            <SessionProvider>
                <AuthHandler>
                    <Component {...pageProps} />
                </AuthHandler>
            </SessionProvider>
        </>
    )
}
