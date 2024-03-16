'use client';

import { Calendar, Edit, Trash } from '@/components/icons';
import Button from '@/components/Button';
import { BUTTON_ICON_SIZE } from '.';
import { TermPayload } from '@/lib/types';
import { formatTermDate, formatTermVacationDate } from '@/lib/date';
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
                <h1>{props.term.name}</h1>

                <div className={styles.iconField}>
                    <Calendar size={16} color='light' />

                    <p>{formatTermDate(props.term.start, props.term.end)}</p>
                </div>

                {props.term.vacations.length > 0 && (
                    <div className={styles.termVacations}>
                        {props.term.vacations.map((vacation) => (
                            <p key={vacation.id}>
                                <span className={styles.white}>
                                    {vacation.name}
                                </span>

                                {' | '}

                                {formatTermVacationDate(
                                    vacation.start,
                                    vacation.end
                                )}
                            </p>
                        ))}
                    </div>
                )}
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
