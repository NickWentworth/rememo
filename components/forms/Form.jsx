import styles from './forms.module.css';

export function Form({ title, onSubmit, close, children }) {
    return (
        <div className={styles.page}>
            <div className={styles.background} />

            <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.header}>
                    <h1>{title}</h1>
                    <img
                        className={styles.close + ' interactableHighlight'}
                        src='/images/icons/closeWhite.png'
                        width={50} height={50}
                        onClick={() => close()}
                    />
                </div>

                <hr />

                <div className={styles.content}>
                    {children}
                </div>

                <hr />

                <button className={styles.submit} type='submit'>Submit</button>
            </form>
        </div>
    )
}
