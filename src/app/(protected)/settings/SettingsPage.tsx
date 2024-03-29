'use client';

import { Info } from '@/components/icons';
import Button from '@/components/Button';
import Panel from '@/components/Panel';
import { trpc } from '@/lib/trpc/client';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './settings.module.css';

export default function SettingsPage() {
    const { data: user, status } = trpc.user.get.useQuery();
    const { mutate: deleteUser } = trpc.user.permanentlyDelete.useMutation();

    const [hideTooltip, setHideTooltip] = useState(true);

    function onDeleteClick() {
        if (
            confirm(
                'Are you sure you want to delete your account?\nThis action is irreversible and all data will be permanently deleted.'
            )
        ) {
            deleteUser();
        }
    }

    const body = (() => {
        if (status === 'error') {
            return <p>Error!</p>;
        }

        if (status === 'pending') {
            return <p>Loading...</p>;
        }

        return (
            <>
                <div className={styles.userProfile}>
                    <div
                        className={styles.userProfileLabel}
                        onMouseLeave={() => setHideTooltip(true)}
                        onMouseOver={() => setHideTooltip(false)}
                    >
                        <h3>User Profile</h3>

                        <div>
                            <Info size={20} color='white' />
                        </div>

                        <p className={styles.infoTooltip} hidden={hideTooltip}>
                            Profile picture and name must be changed through
                            your Google profile
                        </p>
                    </div>

                    <img src={user.image ?? ''} className={styles.userImage} />

                    <div className={styles.userName}>
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                    </div>
                </div>

                <hr className={styles.hr} />

                <div>
                    <Button type='outline' onClick={signOut}>
                        Sign Out
                    </Button>
                </div>

                <div>
                    {/* TODO: add red warning variant for buttons */}
                    <Button type='solid' onClick={onDeleteClick}>
                        Delete Account
                    </Button>
                </div>
            </>
        );
    })();

    return <Panel header={<h1>Settings</h1>} body={body} flex={1} />;
}
