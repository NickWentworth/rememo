import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import styles from './userPanel.module.css';

export function UserPanel({ extend }) {
    const router = useRouter();
    const { data, status } = useSession();

    if (status !== 'authenticated') {
        return null;
    }

    return (
        <div className={styles.userPanel}>
            {/* TODO - convert img to next Image */}
            <div className={styles.userImageContainer}>
                <img
                    className={styles.userImage}
                    src={data.user.image}
                    width={50}
                    height={50}
                />

                <h4 hidden={!extend}>
                    {/* display first name */}
                    {data.user.name.split(' ')[0]}
                </h4>
            </div>

            <div className={styles.userOptionsList}>
                <a className='interactableHighlight' onClick={() => router.push('/settings')} hidden={!extend}>
                    Settings
                </a>

                <a className='interactableHighlight' onClick={() => signOut()} hidden={!extend}>
                    Sign Out
                </a>
            </div>
        </div>
    )
}
