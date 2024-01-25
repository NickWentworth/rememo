import { Logo } from '@/components/icons';
import ProviderButton from './ProviderButton';
import { redirect } from 'next/navigation';
import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import styles from './login.module.css';

const LOGO_SIZE = 64;

export default async function Login() {
    // reroute if user is already signed in
    if (await getServerSession()) {
        return redirect('/dashboard');
    }

    const providers = await getProviders();

    return (
        <div className={styles.fill}>
            <div className={styles.body}>
                <Logo size={LOGO_SIZE} color='accent' />

                <h2>Sign in to access Rememo</h2>

                {providers ? (
                    Object.values(providers).map((p) => (
                        <ProviderButton key={p.id} provider={p} />
                    ))
                ) : (
                    <p>Error: no providers were found!</p>
                )}
            </div>
        </div>
    );
}
