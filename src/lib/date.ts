export const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Returns a `Date` object after modifying a given one's date, leaving time untouched
 *
 * Expects given date to be in YYYY-MM-DD format
 *
 * If given date is an invalid string, returns an unchanged date
 */
export function updateDate(current: Date, date: string): Date {
    const [year, month, day] = date.split('-').map((s) => Number.parseInt(s));

    const isValidDateString =
        typeof year === 'number' &&
        typeof month === 'number' &&
        month >= 1 &&
        month <= 12 &&
        typeof day === 'number' &&
        // TODO: not really checking for valid days per month here, ex: feb. 31st would be a valid date
        day >= 1 &&
        day <= 31;

    if (isValidDateString) {
        const copy = new Date(current);
        // month is given as 0-indexed from 0=jan to 11=dec
        copy.setUTCFullYear(year, month - 1, day);
        return copy;
    } else {
        return current;
    }
}

/**
 * Returns a `Date` object after modifying a given one's time, leaving date untouched
 *
 * Expects given time to be in 24-hour HH:MM format
 *
 * If given time is an invalid string, returns an unchanged date
 */
export function updateTime(current: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map((s) => Number.parseInt(s));

    const isValidTimeString =
        typeof hours === 'number' &&
        hours >= 0 &&
        hours <= 23 &&
        typeof minutes === 'number' &&
        minutes >= 0 &&
        minutes <= 59;

    if (isValidTimeString) {
        const copy = new Date(current);
        copy.setUTCHours(hours, minutes);
        return copy;
    } else {
        return current;
    }
}

// TODO: enable user to give custom default time
/**
 * Returns a `Date` object representing tonight at 11:59 PM
 */
export function tonightUTC(time?: string): Date {
    const tonight = new Date().toISOString().split('T')[0];

    return new Date(`${tonight}T${time ?? '23:59'}Z`);
}

/**
 * Returns a `Date` object set to the local timezone's time, but with a timezone offset of 0
 *
 * Required for comparing an input-generated `Date`, as they are stored as a UTC timezone (yyyy-mm-ddThh:mmZ)
 */
export function nowUTC(): Date {
    const now = new Date();

    const utc = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes()
        // further precision is not needed,
    );

    return new Date(utc);
}

/**
 * Returns a new `Date` object that is `day`s ahead from the given `from` date
 */
export function daysAhead(from: Date, days: number): Date {
    return new Date(from.getTime() + days * MS_PER_DAY);
}

/**
 * Returns `true` if both of the given dates are a part of the same day
 */
export function isSameDay(a: Date, b: Date): boolean {
    return (
        Math.floor(a.getTime() / MS_PER_DAY) ===
        Math.floor(b.getTime() / MS_PER_DAY)
    );
}

/**
 * Returns the date of the given `Date` in YYYY-MM-DD format
 */
export function dateISO(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Returns the time of the given `Date` in 24-hour HH:MM format
 */
export function timeISO(date: Date): string {
    return date.toISOString().split('T')[1].replace('Z', '');
}

/**
 * Formats the given start and end date to display on a term card
 */
export function formatTermDate(start: Date, end: Date): string {
    const format = (d: Date) =>
        d.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    return `${format(start)} — ${format(end)}`;
}

/**
 * Formats the given due date to display on a task card
 */
export function formatTaskDate(due: Date): string {
    const now = nowUTC();

    const dueDay = Math.floor(due.getTime() / MS_PER_DAY);
    const nowDay = Math.floor(now.getTime() / MS_PER_DAY);

    const time = due.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
    });

    const weekday = due.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'long',
    });

    const fullDaysAway = dueDay - nowDay;
    const overdue = due < now;

    switch (true) {
        case fullDaysAway < -1:
            return `Overdue by ${-fullDaysAway} days`;

        case fullDaysAway == -1:
            return `Due yesterday @ ${time}`;

        case fullDaysAway == 0:
            return `Due ${overdue ? 'earlier' : ''} today @ ${time}`;

        case fullDaysAway == 0 && !overdue:
            return `Due today @ ${time}`;

        case fullDaysAway == 1:
            return `Due tomorrow @ ${time}`;

        case fullDaysAway < 7:
            return `Due ${weekday} @ ${time}`;

        case fullDaysAway < 13:
            return `Due next ${weekday} @ ${time}`;

        default:
            return `Due in ${fullDaysAway} days`;
    }
}

/**
 * Formats the given start of the week date for displaying in the calendar's header
 *
 * Returns in the form Month DD, YYYY - Month DD YYYY with first YYYY omitted if the week is in the same year
 */
export function formatCalendarWeeklyRange(weekStart: Date): string {
    const weekEnd = daysAhead(weekStart, 6);

    const sameYear = weekStart.getFullYear() === weekEnd.getFullYear();

    const format = (date: Date, includeYear: boolean) =>
        date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: includeYear ? 'numeric' : undefined,
        });

    return `${format(weekStart, !sameYear)} — ${format(weekEnd, true)}`;
}

/**
 * Formats the date for displaying in the header of a day on the calendar
 *
 * Returns in the form Weekday MM/DD
 */
export function formatCalendarWeeklyDate(date: Date): string {
    return date
        .toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'numeric',
            day: 'numeric',
        })
        .replace(',', '');
}

/**
 * Formats the time range for displaying in an event on the calendar
 *
 * Returns in the form HH:MM AM/PM - HH:MM AM/PM
 */
export function formatCalendarEventTimeRange(start: Date, end: Date): string {
    const format = (d: Date) =>
        d.toLocaleTimeString('en-US', {
            timeZone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
        });

    return `${format(start)} — ${format(end)}`;
}
