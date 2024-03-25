import styles from './structure.module.css';

export function FormSection(props: React.PropsWithChildren) {
    return <div className={styles.section}>{props.children}</div>;
}
