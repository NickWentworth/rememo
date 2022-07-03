import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { iconSize } from './Sidebar';
import styles from './sidebar.module.css';

export function UserSection({ extend }) {
    const router = useRouter();
    const { data, status } = useSession();

    if (status !== 'authenticated') {
        return null;
    }

    return (
        <div className={styles.userSection}>
            <div className={styles.user}>
                <img
                    src={data.user.image}
                    width={iconSize}
                    height={iconSize}
                    referrerPolicy='no-referrer' // google was sometimes giving 403 errors without this
                />

                <h4 hidden={!extend}>
                    {/* display first name */}
                    {data.user.name.split(' ')[0]}
                </h4>
            </div>

            <div className={styles.links} style={{display: extend ? '' : 'none'}}>
                <a className={styles.section + ' interactableHighlight'} onClick={() => router.push('/settings')}>
                    Settings
                </a>

                <a className={styles.section + ' interactableHighlight'} onClick={() => signOut()}>
                    Sign Out
                </a>
            </div>
        </div>
    )
}
