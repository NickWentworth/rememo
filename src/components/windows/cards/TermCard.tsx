'use client';

import { Calendar, Edit, Trash } from '@/components/icons';
import Button from '@/components/Button';
import { BUTTON_ICON_SIZE } from '.';
import { TermPayload } from '@/lib/types';
import { formatTermDate } from '@/lib/date';
import { useInitialTerm } from '@/lib/query/terms';
import { useState } from 'react';
import styles from './card.module.css';

type TermCardProps = {
    term: TermPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    selected: boolean;
    onClick?: () => void;
};

export function TermCard(props: TermCardProps) {
    const { data: term, status } = useInitialTerm(props.term);

    const [hovering, setHovering] = useState(false);

    const borderColor = props.selected ? 'var(--white)' : 'transparent';

    if (status === 'error') {
        return;
    }

    return (
        <div
            className={`${styles.card} ${styles.termCard}`}
            style={{ borderColor }}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={styles.body} onClick={props.onClick}>
                <h1>{term.name}</h1>

                <div className={styles.iconField}>
                    <Calendar size={16} color='light' />

                    <p>{formatTermDate(term.start, term.end)}</p>
                </div>
            </div>

            <div className={styles.buttons}>
                <Button
                    type='transparent'
                    onClick={props.onEditClick}
                    icon={
                        <Edit
                            size={BUTTON_ICON_SIZE}
                            color={hovering ? 'white' : 'transparent'}
                        />
                    }
                    usualPadding
                    border='square'
                />

                <Button
                    type='transparent'
                    onClick={props.onDeleteClick}
                    icon={
                        <Trash
                            size={BUTTON_ICON_SIZE}
                            color={hovering ? 'white' : 'transparent'}
                        />
                    }
                    usualPadding
                    border='square'
                />
            </div>
        </div>
    );
}
