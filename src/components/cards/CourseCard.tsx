'use client';

import { Edit, Location, Trash, User } from '@/components/icons';
import Button from '@/components/Button';
import { BUTTON_ICON_SIZE } from '.';
import { formatCourseTimeDays, formatCourseTimeRange } from '@/lib/date';
import { CoursePayload } from '@/lib/types';
import { bitfieldToList } from '@/lib/bitfield';
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

                {(props.course.instructor || props.course.location) && (
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
                )}

                {props.course.times.length > 0 && (
                    <div className={styles.courseDataSection}>
                        {props.course.times.map((time) => (
                            <p key={time.id}>
                                <span className={styles.white}>
                                    {formatCourseTimeRange(
                                        time.start,
                                        time.end
                                    )}
                                </span>

                                {' | '}

                                {formatCourseTimeDays(
                                    bitfieldToList(time.days)
                                )}
                            </p>
                        ))}
                    </div>
                )}
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
