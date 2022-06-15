import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import '../styles/global.css';
import '../styles/classes.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <link rel='icon' href='/images/favicon.ico' />
            </Head>
            
            <SessionProvider>
                <Auth>
                    <Component {...pageProps} />
                </Auth>
            </SessionProvider>
        </>
    )
}

function Auth({ children }) {
    useSession({
        required: true
    });
    
    return children;
}
