import { SIDEBAR_ICON_SIZE } from './Sidebar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './sidebar.module.css';

type UserButtonProps = {
    expanded: boolean;
};

export function UserButton(props: UserButtonProps) {
    const session = useSession();
    const user = session.data?.user;

    if (!user) {
        return;
    }

    return (
        <Link className={styles.button} href='/settings'>
            <img
                className={styles.userImage}
                src={user?.image ?? undefined}
                width={SIDEBAR_ICON_SIZE}
                height={SIDEBAR_ICON_SIZE}
            />

            {/* TODO: handle overflowing name */}
            {props.expanded && (
                <div className={styles.userName}>
                    <h4 className={styles.userName}>{user?.name}</h4>
                </div>
            )}
        </Link>
    );
}
