import { SessionProvider, useSession, signIn } from 'next-auth/react';
import '../styles/global.css';
import '../styles/classes.css';

export default function App({ Component, pageProps }) {
    return (
        <SessionProvider>
            <Auth>
                <Component {...pageProps} />
            </Auth>
        </SessionProvider>
    )
}

function Auth({ children }) {
    useSession({
        required: true
    });
    
    return children;
}
