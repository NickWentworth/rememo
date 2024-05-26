import { MS_PER_DAY, daysAhead } from '@/lib/date';
import { useCurrentTime } from '@/lib/hooks/useCurrentTime';
import { useElementAttribute } from '@/lib/hooks/useElementAttribute';
import { useEffect, useRef, useState } from 'react';

export type CalendarController = ReturnType<typeof useCalendarController>;

type UseCalendarOptions = {
    /** How to determine the calendar start date based on current date */
    startDate: (now: Date) => Date;

    /** How many days to move the calendar start date on next/prev click */
    daysChanged: number;

    /** Initial time to scroll the calendar body to */
    initialTime?: number;
};

export function useCalendarController(opts: UseCalendarOptions) {
    // determine calendar start time based on provided function
    const now = useCurrentTime();
    const [calendarStart, setCalendarStart] = useState(opts.startDate(now));

    // setup onClicks for the calendar header
    function onTodayClick() {
        setCalendarStart(now);
    }
    function onPrevClick() {
        setCalendarStart((curr) => daysAhead(curr, -opts.daysChanged));
    }
    function onNextClick() {
        setCalendarStart((curr) => daysAhead(curr, opts.daysChanged));
    }

    // store ref to calendar body for precise placement of events
    const [bodyRef, bodyHeight] = useElementAttribute('div', 'offsetHeight', 0);

    function heightOf(date: Date) {
        // get the date's time of day in a range [0,1], where 0 = 12:00am and 1 = 11:59pm
        const t = (date.getTime() % MS_PER_DAY) / MS_PER_DAY;

        // then scale by height of calendar body element
        return t * bodyHeight;
    }

    // store ref to scrolling div of calendar to allow initial scrolling amount
    const scrollRef = useRef<React.ElementRef<'div'>>(null);
    useEffect(() => {
        if (scrollRef.current && opts.initialTime) {
            const time = new Date();
            time.setUTCHours(opts.initialTime, 0, 0, 0);

            scrollRef.current.scrollTo({ top: heightOf(time) });
        }
    }, [scrollRef, bodyHeight]);

    return {
        now,
        calendarStart,
        onTodayClick,
        onPrevClick,
        onNextClick,
        bodyRef,
        heightOf,
        scrollRef,
    } as const;
}
