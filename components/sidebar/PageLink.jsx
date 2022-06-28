import { iconSize } from './Sidebar';
import styles from './sidebar.module.css';

export function PageLink({ name, link, iconPath, extend, focused }) {
    return (
        <a href={link}>
            <div className={styles.panel + ' interactableHighlight'}>
                <img src={iconPath.replace('[color]', focused ? 'Accent' : 'White')} width={iconSize} height={iconSize} />

                <h3 className={styles.panelText} hidden={!extend} style={{ color: focused ? 'var(--accent)' : '' }}>{name}</h3>
            </div>
        </a>
    )
}
