'use client';

import { useReducer } from 'react';
import styles from './sidebar.module.css';
import { Calendar, Courses, Dashboard, Hamburger, Logo, Tasks } from '../icons';

const ICON_SIZE = 32;
const LOGO_SIZE = ICON_SIZE + 16;

export function Sidebar() {
    const [expanded, toggleExpanded] = useReducer((curr) => !curr, true);

    return (
        <div className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <Logo color='accent' size={LOGO_SIZE} />
                {expanded && <h1 className={styles.logoText}>Rememo</h1>}
            </div>

            <hr />

            {/* Links */}
            <div className={styles.links}>
                <PageLink
                    name='Dashboard'
                    icon={<Dashboard color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
                <PageLink
                    name='Tasks'
                    icon={<Tasks color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
                <PageLink
                    name='Courses'
                    icon={<Courses color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
                <PageLink
                    name='Calendar'
                    icon={<Calendar color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
            </div>

            {/* Hamburger */}
            <div className={styles.hamburger}>
                <button
                    className={`${styles.hamburgerButton} ${styles.button}`}
                    onClick={toggleExpanded}
                >
                    <Hamburger color='white' size={ICON_SIZE} />
                </button>
            </div>
        </div>
    );
}

type PageLinkProps = {
    name: string;
    icon: React.ReactNode;
    // TODO: redirect to a page
    // to: string;
    expanded: boolean;
};

function PageLink(props: PageLinkProps) {
    return (
        <button className={`${styles.pageLink} ${styles.button}`}>
            {props.icon}
            {props.expanded && <h4>{props.name}</h4>}
        </button>
    );
}
