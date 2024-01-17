'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    return (
        <button onClick={() => signOut()}>
            <h3>Sign Out</h3>
        </button>
    );
}
