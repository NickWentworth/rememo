import { SIDEBAR_ICON_SIZE } from './Sidebar';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import styles from './sidebar.module.css';

type UserButtonProps = {
    expanded: boolean;
};

export function UserButton(props: UserButtonProps) {
    const { data: user } = trpc.user.get.useQuery();

    if (user === undefined) {
        return;
    }

    return (
        <Link className={styles.button} href='/settings'>
            <img
                className={styles.userImage}
                src={user.image ?? undefined}
                width={SIDEBAR_ICON_SIZE}
                height={SIDEBAR_ICON_SIZE}
            />

            {props.expanded && (
                <h4 className={styles.userName}>{user?.name}</h4>
            )}
        </Link>
    );
}
