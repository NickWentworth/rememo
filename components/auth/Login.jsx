import { useEffect, useState } from 'react';
import { getProviders } from 'next-auth/react';
import Head from 'next/head';
import { Loading } from '../Loading';
import { ProviderButton } from './ProviderButton';
import styles from './auth.module.css'

export function Login() {
    const [providers, setProviders] = useState(null);

    useEffect(async () => {
        await setProviders(await getProviders());
        
        console.log(providers);
    }, [])
    
    if (providers == null) {
        return <Loading />
    }

    return (
        <>
            <Head>
                <title>Login • Rememo</title>
            </Head>

            <div className={styles.page}>
                <div className={styles.content + ' boxShadowDark'}>
                    <img src='/images/logos/rememoFullAccent.svg' height={100} />

                    <hr />
                    <p>Please sign in to access Rememo</p>
                    <hr />

                    {Object.values(providers).map((provider) => (
                        <ProviderButton key={provider.id} provider={provider} image={`/images/logos/${provider.name}[color].png`} />
                    ))}
                    
                    {/* TEMP */}
                    {Object.values(providers).map((provider) => (
                        <ProviderButton key={provider.id} provider={provider} image={`/images/logos/${provider.name}[color].png`} />
                    ))}
                    {Object.values(providers).map((provider) => (
                        <ProviderButton key={provider.id} provider={provider} image={`/images/logos/${provider.name}[color].png`} />
                    ))}
                    
                    {/* ---- */}
                </div>
            </div>
        </>
    )
}
