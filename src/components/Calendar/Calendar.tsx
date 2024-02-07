'use client';

import { Left, Right } from '../icons';
import Button from '../Button';
import {
    MS_PER_DAY,
    daysAhead,
    formatCalendarEventTimeRange,
    formatCalendarWeeklyDate,
    formatCalendarWeeklyRange,
    isSameDay,
} from '@/lib/date';
import { useEffect, useRef, useState } from 'react';
import styles from './calendar.module.css';

// TODO: move to a utility function in /src/lib
type ClassValue = string | boolean | undefined;
function buildClass(...classes: ClassValue[]): string {
    return classes.filter((c) => c !== false ?? false).join(' ');
}

type CalendarProps = {
    events: CalendarEvent[];
    start?: number;
    end?: number;
};

// TODO: use courses instead after courseTimes are implemented
type CalendarEvent = {
    name: string;
    start: Date;
    end: Date;
    days: number[];
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

    // to allow placing between segments in the calendar, store its height for calculations
    const tableRef = useRef<React.ElementRef<'div'>>(null);
    const [tableHeight, setTableHeight] = useState(0);

    // update table height when the ref is properly set
    useEffect(() => {
        if (tableRef.current) {
            setTableHeight(tableRef.current.offsetHeight);
        }
    }, [tableRef]);

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
            <div className={styles.tabular} ref={tableRef}>
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

                    const events = props.events
                        .filter((event) => event.days.includes(d))
                        .map((event, idx) => {
                            // TODO: extract as utils function
                            // convert the date value to a range 0-1 representing how far along the calendar it should be displayed
                            const inverseLerp = (date: Date) => {
                                // get a value 0-1 representing how far in the day the given date's time is
                                const t =
                                    (date.getTime() % MS_PER_DAY) / MS_PER_DAY;

                                // get a min and max value from 0-1 representing the range the calendar is showing
                                const min = (props.start ?? 0) / 24;
                                const max = (props.end ?? 24) / 24;

                                // inverse lerp between the calendar's min and max values
                                return (t - min) / (max - min);
                            };

                            // calculate start and end percentages to display this event
                            const start = inverseLerp(event.start);
                            const end = inverseLerp(event.end);

                            // scale by total table height (subtract 1 to show borders between events)
                            const top = Math.floor(tableHeight * start);
                            const height =
                                Math.floor(tableHeight * (end - start)) - 1;

                            return (
                                <div
                                    key={idx}
                                    className={styles.eventContainer}
                                    style={{ top, height }}
                                >
                                    <div className={styles.event}>
                                        <h3>{event.name}</h3>
                                        <p>
                                            {formatCalendarEventTimeRange(
                                                event.start,
                                                event.end
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        });

                    return (
                        <div key={d} className={cn}>
                            {hourRange
                                .flatMap((h) => [h, h])
                                .map((_, idx) => (
                                    <div key={idx} className={styles.cell} />
                                ))}

                            {...events}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
