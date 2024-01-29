'use client';

import { Info } from '../icons';
import Button from '@/components/Button';
import { useUser } from '@/providers';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from './window.module.css';

function onDeleteClick() {
    if (
        confirm(
            'Are you sure you want to delete your account?\nThis action is not reversible and all data will be deleted.'
        )
    ) {
        alert('TODO: delete account here');
    }
}

export function SettingsWindow() {
    const user = useUser();

    const [hideTooltip, setHideTooltip] = useState(true);

    return (
        <div className={`${styles.window} ${styles.settings}`}>
            <div className={styles.header}>
                <h1>Settings</h1>
            </div>

            <div className={`${styles.list} ${styles.settings}`}>
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

                <hr />

                <Button type='outline' onClick={signOut}>
                    Sign Out
                </Button>

                {/* TODO: add red warning variant for buttons */}
                <Button type='solid' onClick={onDeleteClick}>
                    Delete Account
                </Button>
            </div>
        </div>
    );
}
