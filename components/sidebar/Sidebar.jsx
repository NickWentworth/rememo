import { useState } from 'react';
import { useRouter } from 'next/router';
import { PageLink } from './PageLink';
import { UserSection } from './UserSection';
import styles from './sidebar.module.css';

// TODO - maintain sidebar extend state between pages

export const iconSize = 50;

export function Sidebar() {
    const [extend, setExtend] = useState(true);
    const router = useRouter();

    return (
        <nav className={styles.sidebar + ' boxShadowDark'}>
            <div className={styles.logo}>
                <img alt='Rememo Logo' src='/images/logos/rememoWhite.svg' width={iconSize} height={iconSize} />
            </div>

            <div>
                <PageLink
                    name='Tasks'
                    link='/tasks'
                    iconPath='/images/icons/tasks[color].png'
                    extend={extend}
                    focused={router.asPath === '/tasks'}
                />

                <hr />

                <PageLink
                    name='Courses'
                    link='/courses'
                    iconPath='/images/icons/courses[color].png'
                    extend={extend}
                    focused={router.asPath === '/courses'}
                />

                <hr />
            </div>

            <div className={styles.grow}></div>

            <div>
                <hr />

                <UserSection extend={extend} />

                <hr />

                <div className={styles.panel + ' ' + styles.menuIcon + ' interactableHighlight'} onClick={() => setExtend(!extend)}>
                    <img alt='Expand' src='/images/icons/menuWhite.png' width={iconSize} height={iconSize} layout='fixed' />
                </div>
            </div>
        </nav>
    )
}
