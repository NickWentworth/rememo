'use client';

import { Button } from '@chakra-ui/react';
import { ClientSafeProvider, signIn } from 'next-auth/react';

const PROVIDER_ICON_SIZE = 24;

type ProviderButtonProps = {
    provider: ClientSafeProvider;
};

export function ProviderButton(props: ProviderButtonProps) {
    const providerIcon = `https://authjs.dev/img/providers/${props.provider.id}.svg`;

    return (
        <Button
            size='lg'
            variant='outline'
            colorScheme='accent'
            onClick={() => signIn(props.provider.id)}
            leftIcon={<img src={providerIcon} height={PROVIDER_ICON_SIZE} />}
        >
            Sign in with {props.provider.name}
        </Button>
    );
}
