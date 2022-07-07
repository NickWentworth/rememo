import styles from './Background.module.css';

// TODO - keep track of z-index to allow multiple backgrounds to stack

// fills the entire viewport and centers children
export function Background({ color, children }) {
    return (
        <div className={styles.fill}>
            <div className={styles.background} style={{ backgroundColor: color || '' }} />
            {children}
        </div>
    )
}