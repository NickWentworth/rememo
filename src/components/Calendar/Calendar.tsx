'use client';

import { Left, Right } from '../icons';
import Button from '../Button';
import {
    daysAhead,
    formatCalendarWeeklyDate,
    formatCalendarWeeklyRange,
    isSameDay,
} from '@/lib/date';
import { useState } from 'react';
import styles from './calendar.module.css';

// TODO: move to a utility function in /src/lib
type ClassValue = string | boolean | undefined;
function buildClass(...classes: ClassValue[]): string {
    return classes.filter((c) => c !== false ?? false).join(' ');
}

type CalendarProps = {
    start?: number;
    end?: number;
};

const range = (a: number, b: number) =>
    Array.from({ length: b - a }, (_, key) => key + a);

export default function Calendar(props: CalendarProps) {
    const now = new Date();

    const [weekStart, setWeekStart] = useState(daysAhead(now, -now.getDay()));

    // onClick functions for calendar controls
    const prevWeek = () => setWeekStart((c) => daysAhead(c, -7));
    const nextWeek = () => setWeekStart((c) => daysAhead(c, 7));

    // ranges used when building calendar
    const dayRange = range(0, 7);
    const hourRange = range(props.start ?? 0, props.end ?? 24);

    return (
        <div className={styles.calendar}>
            {/* main header for calendar with week and controls */}
            <div className={styles.header}>
                <Button
                    type='transparent'
                    icon={<Left size={30} color='light' />}
                    border='round'
                    onClick={prevWeek}
                />

                <h1>{formatCalendarWeeklyRange(weekStart)}</h1>

                <Button
                    type='transparent'
                    icon={<Right size={30} color='light' />}
                    border='round'
                    onClick={nextWeek}
                />
            </div>

            {/* calendar weekly header row */}
            <div className={styles.tabular}>
                {/* labels for each day of the week */}
                <h4 className={styles.tableDate} />

                {dayRange.map((i) => {
                    const day = daysAhead(weekStart, i);
                    const cn = buildClass(
                        styles.tableDate,
                        isSameDay(day, now) && styles.today
                    );

                    return (
                        <h3 key={i} className={cn}>
                            {formatCalendarWeeklyDate(day)}
                        </h3>
                    );
                })}
            </div>

            {/* calendar body section */}
            <div className={styles.tabular}>
                {/* times */}
                <div className={styles.times}>
                    {hourRange.flatMap((h) => {
                        const hour = ((h + 11) % 12) + 1;
                        const display = `${hour}:00 ${
                            h >= 1 && h <= 12 ? 'AM' : 'PM'
                        }`;

                        return [
                            <div key={h} className={styles.cell}>
                                <p>{display}</p>
                            </div>,
                            <div key={`${h}empty`} className={styles.cell} />,
                        ];
                    })}
                </div>

                {/* days of the week */}
                {dayRange.map((d) => {
                    const day = daysAhead(weekStart, d);
                    const cn = buildClass(
                        styles.day,
                        isSameDay(day, now) && styles.today
                    );

                    return (
                        <div key={d} className={cn}>
                            {hourRange
                                .flatMap((h) => [h, h])
                                .map((_, idx) => (
                                    <div key={idx} className={styles.cell} />
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
