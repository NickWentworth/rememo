'use client';

import { useReducer } from 'react';
import styles from './sidebar.module.css';
import { Calendar, Courses, Dashboard, Hamburger, Logo, Tasks } from '../icons';
import Link from 'next/link';

const ICON_SIZE = 32;
const LOGO_SIZE = ICON_SIZE + 16;

export function Sidebar() {
    const [expanded, toggleExpanded] = useReducer((curr) => !curr, true);

    return (
        <div className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <Logo color='accent' size={LOGO_SIZE} />
                {expanded && (
                    <h1 className={`${styles.logoText} logoFont`}>Rememo</h1>
                )}
            </div>

            <hr />

            {/* Links */}
            <div className={styles.links}>
                <PageLink
                    name='Dashboard'
                    to='/dashboard'
                    icon={<Dashboard color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
                <PageLink
                    name='Tasks'
                    to='/tasks'
                    icon={<Tasks color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
                <PageLink
                    name='Courses'
                    to='/courses'
                    icon={<Courses color='white' size={ICON_SIZE} />}
                    expanded={expanded}
                />
                <PageLink
                    name='Calendar'
                    to='/calendar'
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
    // display name of link
    name: string;
    // routing location of link
    to: string;
    // icon to display
    icon: React.ReactNode;
    // is the sidebar expanded?
    expanded: boolean;
};

function PageLink(props: PageLinkProps) {
    return (
        <Link className={styles.pageLink} href={props.to}>
            <button className={`${styles.pageLinkButton} ${styles.button}`}>
                {props.icon}
                {props.expanded && <h3>{props.name}</h3>}
            </button>
        </Link>
    );
}
