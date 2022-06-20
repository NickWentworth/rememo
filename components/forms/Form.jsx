import { useState } from 'react';
import styles from './forms.module.css';

export function Form({ title, onSubmit, children }) {
    const [showForm, setShowForm] = useState(true);

    return (
        <div className={styles.page} style={{ display: showForm ? 'flex' : 'none' }}>
            <div className={styles.background} />

            <form className={styles.form + ' boxShadowDark'} onSubmit={(event) => {
                setShowForm(false);
                onSubmit(event);
            }}>
                <div className={styles.header}>
                    <h1>{title}</h1>
                    <img
                        className={styles.close + ' interactableHighlight'}
                        src='/images/icons/closeWhite.png'
                        width={50} height={50}
                        onClick={() => setShowForm(false)}
                    />
                </div>

                {children}

                <button className={styles.submit} type='submit'>Submit</button>
            </form>
        </div>
    )
}
