import { SVGComponent } from '../icons/props';
import { SIDEBAR_ICON_SIZE } from './Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

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

export function PageLink(props: PageLinkProps) {
    // is this page link the active one?
    const active = usePathname() === props.to;

    // styling for the link's display name, if shown
    const textStyle = { color: `var(--${active ? 'accent' : 'white'})` };

    // icon to render
    const icon = props.icon({
        color: active ? 'accent' : 'white',
        size: SIDEBAR_ICON_SIZE,
    });

    return (
        <Link className={styles.button} href={props.to}>
            {icon}
            {props.expanded && <h1 style={textStyle}>{props.name}</h1>}
        </Link>
    );
}
