import styles from './panel.module.css';

type CenteredProps = {
    children: string;
};

export function Centered(props: CenteredProps) {
    return <p className={styles.centered}>{props.children}</p>;
}
