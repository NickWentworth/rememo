'use client';

import { Left, Location, Right } from '../icons';
import Button from '../Button';
import {
    MS_PER_DAY,
    daysAhead,
    formatCourseTimeRange,
    formatCalendarWeeklyDate,
    formatCalendarWeeklyRange,
    isSameDay,
} from '@/lib/date';
import { buildClass, inverseLerp, range } from '@/lib/utils';
import { useElementAttribute } from '@/lib/hooks/useElementAttribute';
import { useCourseTimesByWeek } from '@/lib/query/courses';
import { useState } from 'react';
import styles from './calendar.module.css';

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

export default function Calendar(props: CalendarProps) {
    const now = new Date();

    const [weekStart, setWeekStart] = useState(daysAhead(now, -now.getDay()));

    // query all course times for the given week
    const courseTimeQueries = useCourseTimesByWeek(weekStart);

    // onClick functions for calendar controls
    const prevWeek = () => setWeekStart((c) => daysAhead(c, -7));
    const nextWeek = () => setWeekStart((c) => daysAhead(c, 7));

    // ranges used when building calendar
    const dayRange = range(0, 7);
    const hourRange = range(props.start ?? 0, props.end ?? 24);

    // store calendar height for calculations to allow precise placement of elements within it
    const [tableRef, tableHeight] = useElementAttribute(
        'div',
        'offsetHeight',
        0
    );

    // converts a time extracted from the given date into a px value distance from the top of the calendar
    const heightOf = (date: Date) => {
        // get the date's time of day in a range [0,1], where 0 = 12:00am and 1 = 11:59pm
        const t = (date.getTime() % MS_PER_DAY) / MS_PER_DAY;

        // get values for the calendar's start and end times, using the same range as the date's time
        const calendarStart = (props.start ?? 0) / 24;
        const calendarEnd = (props.end ?? 24) / 24;

        return inverseLerp(calendarStart, calendarEnd, t) * tableHeight;
    };

    // TODO: show loading state overlay until all course times are fetched
    const isLoading = courseTimeQueries.some(
        (query) => query.status !== 'success'
    );

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

                    const courseTimes = courseTimeQueries.at(d)?.data ?? [];

                    return (
                        <div key={d} className={cn}>
                            {hourRange
                                .flatMap((h) => [h, h])
                                .map((_, idx) => (
                                    <div key={idx} className={styles.cell} />
                                ))}

                            {courseTimes.map((time, idx) => {
                                // calculate start and end percentages to display this event
                                const start = heightOf(time.start);
                                const end = heightOf(time.end);

                                // scale by total table height (subtract 1 to show borders between events)
                                const top = Math.floor(start);
                                const height = Math.floor(end - start) - 1;

                                return (
                                    <div
                                        key={idx}
                                        className={styles.eventContainer}
                                        style={{ top, height }}
                                    >
                                        <div className={styles.event}>
                                            <h3
                                                style={{
                                                    color: time.course.color,
                                                }}
                                            >
                                                {time.course.name}
                                            </h3>

                                            <p className={styles.eventTime}>
                                                {formatCourseTimeRange(
                                                    time.start,
                                                    time.end
                                                )}
                                            </p>

                                            <div
                                                className={styles.eventLocation}
                                            >
                                                <Location
                                                    size={14}
                                                    color='light'
                                                />
                                                <p>{time.course.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <p hidden={!isLoading}>Loading...</p>
        </div>
    );
}
