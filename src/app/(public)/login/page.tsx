import { Logo } from '@/components/icons';
import { ProviderButton } from '@/components/Button';
import { buildMetadata } from '@/lib/metadata';
import { isAuthenticated } from '@/lib/actions/user';
import { redirect } from 'next/navigation';
import { getProviders } from 'next-auth/react';
import styles from './login.module.css';

const LOGO_SIZE = 64;

export const metadata = buildMetadata({ title: 'Login' });

export default async function Login() {
    // reroute if user is already signed in
    if (await isAuthenticated()) {
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
