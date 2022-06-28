import styles from './Loading.module.css';

export function Loading() {
    return (
        <div className={styles.wrapper}>
            <img src='images/icons/loading.svg' />
        </div>
    )
}
