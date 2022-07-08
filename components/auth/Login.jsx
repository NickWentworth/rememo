import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import { Loading } from '../Loading';
import styles from './auth.module.css'

export function Login() {
    const [providers, setProviders] = useState(null);

    useEffect(async () => {
        await setProviders(await getProviders());
    }, [])
    
    if (providers == null) {
        return <Loading />
    }

    return (
        <>
            <Head>
                <title>Login • Rememo</title>
            </Head>

            <div className={styles.fill}>
                <div className={styles.content + ' boxShadowDark'}>
                    <img src='/images/logos/rememoFullAccent.svg' height={100} />

                    <hr />
                    <p>Please sign in to access Rememo</p>
                    <hr />
                    
                    {Object.values(providers).map((provider) => (
                        <button key={provider.id} onClick={() => signIn(provider.id)}>
                            <img src={`/images/logos/${provider.name}.png`} height={30} />
                
                            Sign in with {provider.name}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}
