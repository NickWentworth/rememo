import { useState, useEffect, createContext } from 'react';
import LoginPage from '../components/loginPage'
import '../styles/global.css';
import '../styles/classes.css';

export const TokenContext = createContext('');

function useToken() {
    const [token, setToken] = useState('');

    function getToken() {
        let token = localStorage.getItem('token');
        return (token == 'null' || token == 'undefined') ? '' : token;
    }

    function saveToken(token) {
        localStorage.setItem('token', token);
        setToken(token);
    }

    useEffect(() => {
        saveToken(getToken());
    })

    return [token, saveToken];
}

export default function App({ Component, pageProps }) {
    const [token, setToken] = useToken();

    if (!token) {
        return <LoginPage setToken={setToken} />
    }

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            <Component {...pageProps} />
        </TokenContext.Provider>
    )
}
