'use client';

import { useReducer } from 'react';
import styles from './sidebar.module.css';
import { Icon, SVG } from '../icons';

const ICON_SIZE = 32;

export function Sidebar() {
    const [expanded, toggleExpanded] = useReducer((curr) => !curr, true);

    return (
        <div className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>Rememo</div>

            <hr />

            {/* Links */}
            <div className={styles.links}>
                <PageLink name='Dashboard' icon='test' expanded={expanded} />
                <PageLink name='Tasks' icon='test' expanded={expanded} />
                <PageLink name='Courses' icon='test' expanded={expanded} />
                <PageLink name='Calendar' icon='test' expanded={expanded} />
            </div>

            <hr />

            {/* Hamburger */}
            <div className={styles.hamburger}>
                <button
                    className={styles.hamburgerButton}
                    onClick={toggleExpanded}
                >
                    <SVG icon='test' color='light' size={ICON_SIZE} />
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
        // TODO: make reusable button component
        <button className={styles.pageLink}>
            <SVG icon={props.icon} color='light' size={ICON_SIZE} />
            <h4>{props.expanded && props.name}</h4>
        </button>
    );
}
