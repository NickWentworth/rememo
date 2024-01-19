'use client';

import { TermPayload } from '@/lib/types';
import { Calendar, Edit, Trash } from '../icons';
import { formatTermDate } from '@/lib/date';
import { useState } from 'react';
import styles from './card.module.css';

const BUTTON_ICON_SIZE = 20;

type TermCardProps = {
    term: TermPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    selected: boolean;
    onClick?: () => void;
};

export function TermCard(props: TermCardProps) {
    // is the mouse currently hovering over the task card?
    const [hovering, setHovering] = useState(false);

    const borderColor = props.selected ? 'var(--white)' : 'transparent';

    return (
        <div
            className={`${styles.card} ${styles.termCard}`}
            style={{ borderColor }}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={styles.body} onClick={props.onClick}>
                <h1>{props.term.name}</h1>

                <div className={styles.iconField}>
                    <Calendar size={16} color='light' />

                    <p>{formatTermDate(props.term.start, props.term.end)}</p>
                </div>
            </div>

            <div className={styles.buttons}>
                <button
                    className={styles.bannerButton}
                    onClick={props.onEditClick}
                >
                    <Edit
                        size={BUTTON_ICON_SIZE}
                        color={hovering ? 'white' : 'transparent'}
                    />
                </button>

                <button
                    className={styles.bannerButton}
                    onClick={props.onDeleteClick}
                >
                    <Trash
                        size={BUTTON_ICON_SIZE}
                        color={hovering ? 'white' : 'transparent'}
                    />
                </button>
            </div>
        </div>
    );
}
