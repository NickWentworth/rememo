'use client';

import { Edit, Location, Trash, User } from '@/components/icons';
import Button from '@/components/Button';
import { BUTTON_ICON_SIZE } from '.';
import { CoursePayload } from '@/lib/types';
import { useState } from 'react';
import styles from './card.module.css';

type CourseCardProps = {
    course: CoursePayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
};

export function CourseCard(props: CourseCardProps) {
    // is the mouse currently hovering over the task card?
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className={styles.card}
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <div className={styles.body}>
                <h1 style={{ color: props.course.color }}>
                    {props.course.name}
                </h1>

                <div className={styles.courseDataSection}>
                    {props.course.instructor && (
                        <div className={styles.iconField}>
                            <User size={16} color='light' />
                            <p>{props.course.instructor}</p>
                        </div>
                    )}

                    {props.course.location && (
                        <div className={styles.iconField}>
                            <Location size={16} color='light' />
                            <p>{props.course.location}</p>
                        </div>
                    )}
                </div>

                {/* TODO: course times */}
            </div>

            {/* TODO: don't really love the location of these buttons, feels awkward */}
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
