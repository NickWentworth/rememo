'use client';

import Button from '.';
import { ClientSafeProvider, signIn } from 'next-auth/react';

const PROVIDER_ICON_SIZE = 24;

type ProviderButtonProps = {
    provider: ClientSafeProvider;
};

export default function ProviderButton(props: ProviderButtonProps) {
    const providerIcon = `https://authjs.dev/img/providers/${props.provider.id}.svg`;

    return (
        <Button
            type='outline'
            onClick={() => signIn(props.provider.id)}
            icon={<img src={providerIcon} height={PROVIDER_ICON_SIZE} />}
        >
            Sign in with {props.provider.name}
        </Button>
    );
}
