import styles from './Loading.module.css';

export function Loading() {
    return (
        <div className={styles.wrapper}>
            <img alt='Loading' src='images/icons/loading.svg' />
        </div>
    )
}
