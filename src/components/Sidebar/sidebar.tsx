'use client';

import { useReducer } from 'react';
import styles from './sidebar.module.css';
import { Icon, SVG } from '../icons';

const ICON_SIZE = 32;
const LOGO_SIZE = ICON_SIZE + 16;

export function Sidebar() {
    const [expanded, toggleExpanded] = useReducer((curr) => !curr, true);

    return (
        <div className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <SVG icon='test' color='accent' size={LOGO_SIZE} />
                {expanded && <h1 className={styles.logoText}>Rememo</h1>}
            </div>

            <hr />

            {/* Links */}
            <div className={styles.links}>
                <PageLink name='Dashboard' icon='test' expanded={expanded} />
                <PageLink name='Tasks' icon='test' expanded={expanded} />
                <PageLink name='Courses' icon='test' expanded={expanded} />
                <PageLink name='Calendar' icon='test' expanded={expanded} />
            </div>

            {/* Hamburger */}
            <div className={styles.hamburger}>
                <button
                    className={`${styles.hamburgerButton} ${styles.button}`}
                    onClick={toggleExpanded}
                >
                    <SVG icon='test' color='white' size={ICON_SIZE} />
                </button>
            </div>
        </div>
    );
}

type PageLinkProps = {
    name: string;
    icon: Icon;
    // TODO: redirect to a page
    // to: string;
    expanded: boolean;
};

function PageLink(props: PageLinkProps) {
    return (
        <button className={`${styles.pageLink} ${styles.button}`}>
            <SVG icon={props.icon} color='white' size={ICON_SIZE} />
            {props.expanded && <h4>{props.name}</h4>}
        </button>
    );
}
