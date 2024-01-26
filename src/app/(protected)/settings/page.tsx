'use client';

import SignOutButton from '@/components/SignOutButton';
import Button from '@/components/Button';
import { useUser } from '@/providers';

import { Calendar, Tasks } from '@/components/icons';

export default function Settings() {
    const user = useUser();

    return (
        <div>
            <p>Verified user data:</p>
            <pre>{JSON.stringify(user, null, 4)}</pre>
            <SignOutButton />

            {/* TEMP: just testing out the buttons */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    margin: '2rem',
                }}
            >
                <Button
                    type='solid'
                    icon={<Tasks size={20} color='dark' />}
                    disabled
                >
                    Solid Button
                </Button>

                <Button type='outline' disabled>
                    Outlined Button
                </Button>

                <Button type='transparent' disabled>
                    Transparent Button
                </Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    margin: '2rem',
                }}
            >
                <Button type='solid' icon={<Calendar size={20} color='dark' />}>
                    Solid Button
                </Button>

                <Button type='outline'>Outlined Button</Button>

                <Button type='transparent'>Transparent Button</Button>
            </div>
        </div>
    );
}
