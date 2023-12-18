const MS_PER_MINUTE = 1000 * 60;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

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
    const now = new Date();
    const nowUTC = new Date(
        now.getTime() - now.getTimezoneOffset() * MS_PER_MINUTE
    );

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
    const overdue = due < nowUTC;

    switch (true) {
        case fullDaysAway < -1:
            return `Overdue by ${-fullDaysAway} days`;

        case fullDaysAway == -1:
            return `Overdue by ${-fullDaysAway} day`;

        case fullDaysAway == 0:
            return `Due ${overdue ? 'earlier' : ''} today - ${time}`;

        case fullDaysAway == 0 && !overdue:
            return `Due today - ${time}`;

        case fullDaysAway == 1:
            return `Due tomorrow - ${time}`;

        case fullDaysAway < 7:
            return `Due ${weekday} - ${time}`;

        case fullDaysAway < 13:
            return `Due next ${weekday} - ${time}`;

        default:
            return `Due in ${fullDaysAway} days`;
    }
}
