'use client';

import { SessionProviderProps, SessionProvider } from 'next-auth/react';

export function AuthProvider(props: SessionProviderProps) {
    return <SessionProvider>{props.children}</SessionProvider>;
}
