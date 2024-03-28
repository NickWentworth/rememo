'use client';

import { Left, Location, Right } from '../icons';
import Button from '../Button';
import {
    MS_PER_DAY,
    daysAhead,
    formatCourseTimeRange,
    formatCalendarWeeklyDate,
    formatCalendarWeeklyRange,
    formatCalendarDailyRange,
    isSameDay,
    formatTime,
    isBetweenTimes,
} from '@/lib/date';
import { buildClass, inverseLerp, range } from '@/lib/utils';
import { trpc } from '@/lib/trpc/client';
import { useElementAttribute } from '@/lib/hooks/useElementAttribute';
import { useCurrentTime } from '@/lib/hooks/useCurrentTime';
import { useEffect, useRef, useState } from 'react';
import styles from './calendar.module.css';

export type CalendarDisplayMode = 'day' | 'week';

type CalendarProps = {
    display: CalendarDisplayMode;

    /** Start hour to display, defaults to 0 */
    start?: number;

    /** End hour to display, defaults to 24 */
    end?: number;

    /** Initial time to scroll to */
    initialTime?: number;
};

type CalendarDisplayData = {
    // how to generate the start date of the calendar
    start: (now: Date) => Date;
    // how many days are displayed
    range: number;
    // how to format the calendar header based on the start date
    title: (start: Date) => string;
    // calendar start button label
    startButtonLabel: string;
    // show dates above columns?
    showDates: boolean;
};

/** Holds varying data for the calendar that depends upon its display mode */
const DISPLAY_DATA: Record<CalendarDisplayMode, CalendarDisplayData> = {
    day: {
        start: (now) => now,
        range: 1,
        title: (start) => formatCalendarDailyRange(start),
        startButtonLabel: 'Today',
        showDates: false,
    },
    week: {
        start: (now) => daysAhead(now, -now.getDay()),
        range: 7,
        title: (start) => formatCalendarWeeklyRange(start),
        startButtonLabel: 'This Week',
        showDates: true,
    },
};

export default function Calendar(props: CalendarProps) {
    const display = DISPLAY_DATA[props.display];

    const now = useCurrentTime();
    const [calendarStart, setCalendarStart] = useState(display.start(now));

    // ranges used when building calendar
    const dayRange = range(0, display.range).map((d) =>
        daysAhead(calendarStart, d)
    );
    const hourRange = range(props.start ?? 0, props.end ?? 24);

    // query all course times for the given week
    const courseTimesQuery = trpc.course.timesByDateArray.useQuery(dayRange);

    // onClick functions for calendar controls
    const prev = () => setCalendarStart((c) => daysAhead(c, -display.range));
    const next = () => setCalendarStart((c) => daysAhead(c, display.range));
    const today = () => setCalendarStart(display.start(now));

    // store calendar height for calculations to allow precise placement of elements within it
    const [bodyRef, bodyHeight] = useElementAttribute('div', 'offsetHeight', 0);

    // store scrollable calendar container to scroll to an initial given height
    const scrollRef = useRef<React.ElementRef<'div'>>(null);
    useEffect(() => {
        if (scrollRef.current && props.initialTime) {
            const time = new Date();
            time.setUTCHours(props.initialTime, 0, 0, 0);

            scrollRef.current.scrollTo({ top: heightOf(time) });
        }
    }, [scrollRef, bodyHeight]);

    // converts a time extracted from the given date into a px value distance from the top of the calendar
    const heightOf = (date: Date) => {
        // get the date's time of day in a range [0,1], where 0 = 12:00am and 1 = 11:59pm
        const t = (date.getTime() % MS_PER_DAY) / MS_PER_DAY;

        // get values for the calendar's start and end times, using the same range as the date's time
        const calendarStart = (props.start ?? 0) / 24;
        const calendarEnd = (props.end ?? 24) / 24;

        return inverseLerp(calendarStart, calendarEnd, t) * bodyHeight;
    };

    // TODO: show loading state overlay until all course times are fetched
    const isLoading = courseTimesQuery.data === undefined;

    // TODO: break this up into components, waaaaay too much here
    return (
        <div className={styles.calendar}>
            {/* main header for calendar with week and controls */}
            <div className={styles.header}>
                {/* back to today button */}
                <Button type='outline' onClick={today} border='round'>
                    {display.startButtonLabel}
                </Button>

                {/* calendar navigation buttons */}
                <Button
                    type='transparent'
                    icon={<Left size={28} color='light' />}
                    border='round'
                    onClick={prev}
                />
                <Button
                    type='transparent'
                    icon={<Right size={28} color='light' />}
                    border='round'
                    onClick={next}
                />

                {/* calendar title */}
                <h1>{display.title(calendarStart)}</h1>
            </div>

            <div className={styles.table} ref={scrollRef}>
                {/* calendar weekly header row */}
                {display.showDates && (
                    <div className={styles.calendarHeader}>
                        {/* labels for each day of the week */}
                        <h4 className={styles.tableDate} />

                        {dayRange.map((day, idx) => {
                            const cn = buildClass(
                                styles.tableDate,
                                isSameDay(day, now) && styles.today
                            );

                            return (
                                <h3 key={idx} className={cn}>
                                    {formatCalendarWeeklyDate(day)}
                                </h3>
                            );
                        })}
                    </div>
                )}

                {/* calendar body section */}
                <div className={styles.calendarBody} ref={bodyRef}>
                    {/* times */}
                    <div className={styles.times}>
                        {hourRange.flatMap((h) => {
                            const hour = new Date();
                            hour.setUTCHours(h, 0, 0, 0);

                            return [
                                <div key={h} className={styles.cell}>
                                    <p>{formatTime(hour)}</p>
                                </div>,
                                <div
                                    key={`${h}empty`}
                                    className={styles.cell}
                                />,
                            ];
                        })}
                    </div>

                    {/* days of the week */}
                    {dayRange.map((day, idx) => {
                        const isToday = isSameDay(day, now);

                        const dayClass = buildClass(
                            styles.day,
                            isToday && styles.today
                        );

                        const courseTimes =
                            courseTimesQuery.data?.at(idx) ?? [];

                        return (
                            <div key={idx} className={dayClass}>
                                {hourRange
                                    .flatMap((h) => [h, h])
                                    .map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={styles.cell}
                                        />
                                    ))}

                                {courseTimes.map((time, idx) => {
                                    // calculate start and end percentages to display this event
                                    const start = heightOf(time.start);
                                    const end = heightOf(time.end);

                                    // scale by total table height (subtract 1 to show borders between events)
                                    const top = Math.floor(start);
                                    const height = Math.floor(end - start) - 1;

                                    const isActive =
                                        isToday &&
                                        isBetweenTimes(
                                            now,
                                            time.start,
                                            time.end
                                        );

                                    const timeClass = buildClass(
                                        styles.event,
                                        isActive && styles.active
                                    );

                                    return (
                                        <div
                                            key={idx}
                                            className={styles.eventContainer}
                                            style={{ top, height }}
                                        >
                                            <div className={timeClass}>
                                                <h3
                                                    style={{
                                                        color: time.course
                                                            .color,
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

                                                {time.course.location && (
                                                    <div
                                                        className={
                                                            styles.eventLocation
                                                        }
                                                    >
                                                        <Location
                                                            size={14}
                                                            color='light'
                                                        />
                                                        <p>
                                                            {
                                                                time.course
                                                                    .location
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* current time indicator */}
                    <div
                        className={styles.currentTime}
                        style={{ top: heightOf(now) }}
                    >
                        <p className={styles.currentTimeText}>
                            <b>{formatTime(now)}</b>
                        </p>
                        <hr className={styles.currentTimeLine} />
                    </div>
                </div>
            </div>

            {/* TODO: spinner */}
            <p hidden={!isLoading}>Loading...</p>
        </div>
    );
}
