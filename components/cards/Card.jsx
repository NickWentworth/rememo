import { useState } from 'react';
import styles from './cards.module.css';

export const iconSize = 25;

// set focused={null} for no interactability
export function Card({ focused, onEditClick, onDeleteClick, children }) {
    const [showIcons, setShowIcons] = useState(false);

    return (
        <div
            className={styles.card + (focused != null ? ' interactableHighlight' : '')}
            style={{ borderColor: focused ? 'var(--white)' : 'transparent' }}
            onMouseOver={() => setShowIcons(true)}
            onMouseLeave={() => setShowIcons(false)}
        >
            <div className={styles.content}>
                {children}
            </div>

            <div className={styles.icons}>
                <img
                    className='interactableHighlight50'
                    src='/images/icons/editWhite.png'
                    height={iconSize} width={iconSize}
                    style={{ opacity: (showIcons || focused) ? '100%' : '0%' }}
                    onClick={() => onEditClick()}
                />

                <img
                    className='interactableHighlight50'
                    src='/images/icons/deleteWhite.png'
                    height={iconSize} width={iconSize}
                    style={{ opacity: (showIcons || focused) ? '100%' : '0%' }}
                    // TODO - add 'are you sure?' popup before deleting
                    onClick={() => onDeleteClick()}
                />
            </div>
        </div>
    )
}
