import styles from './form.module.css';

export default function FormSection(props: React.PropsWithChildren) {
    return <div className={styles.section}>{props.children}</div>;
}
