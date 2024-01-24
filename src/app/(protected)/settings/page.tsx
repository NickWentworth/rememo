'use client';

import SignOutButton from '@/components/SignOutButton';
import { useUser } from '@/providers';

export default function Settings() {
    const user = useUser();

    return (
        <div>
            <p>Verified user data:</p>
            <pre>{JSON.stringify(user, null, 4)}</pre>
            <SignOutButton />
        </div>
    );
}
