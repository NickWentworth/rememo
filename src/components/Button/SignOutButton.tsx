'use client';

import Button from '.';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    return (
        <Button type='solid' onClick={signOut}>
            Sign Out
        </Button>
    );
}
