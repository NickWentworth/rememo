'use client';

import { Calendar, Courses, Dashboard, Hamburger, Logo, Tasks } from '../icons';
import { PageLink } from './PageLink';
import { UserButton } from './UserButton';
import { useReducer } from 'react';
import styles from './sidebar.module.css';

export const SIDEBAR_ICON_SIZE = 32;
const LOGO_SIZE = SIDEBAR_ICON_SIZE + 16;

export function Sidebar() {
    const [expanded, toggleExpanded] = useReducer((curr) => !curr, false);

    return (
        <div className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <Logo color='accent' size={LOGO_SIZE} />

                {expanded && <h1 className={styles.logoText}>Rememo</h1>}
            </div>

            <hr />

            <div className={styles.sidebarBody}>
                {/* Links */}
                <PageLink
                    name='Dashboard'
                    to='/dashboard'
                    icon={Dashboard}
                    expanded={expanded}
                />
                <PageLink
                    name='Tasks'
                    to='/tasks'
                    icon={Tasks}
                    expanded={expanded}
                />
                <PageLink
                    name='Courses'
                    to='/courses'
                    icon={Courses}
                    expanded={expanded}
                />
                <PageLink
                    name='Calendar'
                    to='/calendar'
                    icon={Calendar}
                    expanded={expanded}
                />

                {/* Filling div */}
                <div className={styles.fill} />

                {/* User */}
                <UserButton expanded={expanded} />

                {/* Hamburger */}
                <button className={styles.button} onClick={toggleExpanded}>
                    <Hamburger color='white' size={SIDEBAR_ICON_SIZE} />
                </button>
            </div>
        </div>
    );
}
