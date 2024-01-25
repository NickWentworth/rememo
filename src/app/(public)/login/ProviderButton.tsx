'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import styles from './login.module.css';

type ProviderButtonProps = {
    provider: ClientSafeProvider;
};

export default function ProviderButton(props: ProviderButtonProps) {
    const providerIcon = `https://authjs.dev/img/providers/${props.provider.id}.svg`;

    return (
        <button
            className={styles.provider}
            onClick={() => signIn(props.provider.id)}
        >
            <img src={providerIcon} />

            <h4>Sign in with {props.provider.name}</h4>
        </button>
    );
}
