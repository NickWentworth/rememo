'use client';

import { Calendar, Courses, Dashboard, Hamburger, Logo, Tasks } from '../icons';
import { SVGComponent } from '../icons/props';
import { useReducer } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

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
    icon: SVGComponent;
    // is the sidebar expanded?
    expanded: boolean;
};

function PageLink(props: PageLinkProps) {
    // is this page link the active one?
    const active = usePathname() === props.to;

    // styling for the link's display name, if shown
    const textStyle = { color: `var(--${active ? 'accent' : 'white'})` };

    // icon to render
    let icon = props.icon({
        color: active ? 'accent' : 'white',
        size: ICON_SIZE,
    });

    return (
        <Link className={styles.pageLink} href={props.to}>
            <button className={`${styles.pageLinkButton} ${styles.button}`}>
                {icon}
                {props.expanded && <h3 style={textStyle}>{props.name}</h3>}
            </button>
        </Link>
    );
}
