import { useState } from 'react';
import styles from './cards.module.css';

export const iconSize = 25;

export function Card({ focused, children }) {
    const [showIcons, setShowIcons] = useState(false);

    return (
        <button
            className={styles.card + ' interactableHighlight'}
            style={{ borderColor: focused ? 'var(--white)' : 'transparent' }}
            onMouseEnter={() => setShowIcons(true)}
            onMouseLeave={() => setShowIcons(false)}
        >
            {children}

            <div className={styles.icons}>
                <img className='interactableHighlight50' src='/images/icons/editWhite.png' height={iconSize} width={iconSize} hidden={!showIcons && !focused} />
                <img className='interactableHighlight50' src='/images/icons/deleteWhite.png' height={iconSize} width={iconSize} hidden={!showIcons && !focused} />
            </div>
        </button>
    )
}
