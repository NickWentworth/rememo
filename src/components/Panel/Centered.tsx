import styles from './panel.module.css';

export function Centered(props: React.PropsWithChildren) {
    let element;

    switch (typeof props.children) {
        case 'string':
            element = <p>{props.children}</p>;
            break;

        default:
            element = <>{props.children}</>;
            break;
    }

    return <div className={styles.centered}>{element}</div>;
}
