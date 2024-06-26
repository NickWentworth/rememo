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
 * Returns a `Date` object set to today at the given time, passed as a string in HH:MM format or a `Date` object
 *
 * If no time is passed, the returned `Date`'s time is defaulted to 00:00
 */
export function todayUTC(time?: string | Date): Date {
    let hours: number;
    let minutes: number;

    switch (typeof time) {
        case 'undefined':
            hours = 0;
            minutes = 0;
            break;

        case 'string':
            const split = time.split(':');

            try {
                hours = Number.parseInt(split.at(0) ?? '0');
                minutes = Number.parseInt(split.at(1) ?? '0');
            } catch {
                console.error(
                    `Given time string '${time}' is not in accepted form HH:MM`
                );
                hours = 0;
                minutes = 0;
            }

            break;

        default:
            // time is given as Date, just take minutes and hours
            hours = time.getUTCHours();
            minutes = time.getUTCMinutes();
            break;
    }

    const now = nowUTC();
    now.setUTCHours(hours, minutes, 0, 0);

    return now;
}

/**
 * Returns a new `Date` object that is `day`s ahead from the given `from` date
 */
export function daysAhead(from: Date, days: number): Date {
    return new Date(from.getTime() + days * MS_PER_DAY);
}

/**
 * Returns a `Date` object set to 11:59 PM this Saturday
 */
export function endOfWeek() {
    const midnight = todayUTC('23:59');
    return daysAhead(midnight, 6 - midnight.getDay());
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
 * Returns `true` if the time segment of the given date is between start and end
 */
export function isBetweenTimes(date: Date, start: Date, end: Date) {
    const time = (d: Date) => d.getTime() % MS_PER_DAY;

    return time(date) > time(start) && time(date) < time(end);
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
 * Returns the given date in HH:MM AM/PM format
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
    });
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
 * Formats the given start and end date to display as a vacation date on a term card
 */
export function formatTermVacationDate(start: Date, end: Date): string {
    const format = (d: Date) =>
        d.toLocaleDateString('en-US', {
            timeZone: 'UTC',
            month: 'short',
            day: 'numeric',
            // year: 'numeric',
        });

    // calculate number of full days between start and end (inclusive, count an extra day)
    const days = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

    if (days === 1) {
        return `${format(start)} (1 day)`;
    } else {
        return `${format(start)} — ${format(end)} (${days} days)`;
    }
}

type FormattedTaskDate = {
    str: string;
    status: TaskStatus;
};

export type TaskStatus = 'late' | 'soon' | 'ok';

/**
 * Formats the given due date to display on a task card
 *
 * Returns an object both containing the formatted string and a status based on completion and due time of the task
 */
export function formatTaskDate(
    due: Date,
    completed: boolean
): FormattedTaskDate {
    const now = nowUTC();

    const dueDay = Math.floor(due.getTime() / MS_PER_DAY);
    const nowDay = Math.floor(now.getTime() / MS_PER_DAY);

    const time = formatTime(due);

    const weekday = due.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'long',
    });

    const fullDaysAway = dueDay - nowDay;
    const overdue = due < now;

    switch (true) {
        case fullDaysAway < -1:
            return {
                str: completed
                    ? `Due ${-fullDaysAway} days ago`
                    : `Overdue by ${-fullDaysAway} days`,
                status: completed ? 'ok' : 'late',
            };

        case fullDaysAway == -1:
            return {
                str: `Due yesterday @ ${time}`,
                status: completed ? 'ok' : 'late',
            };

        case fullDaysAway == 0:
            let status: TaskStatus;

            if (completed) {
                status = 'ok';
            } else if (overdue) {
                status = 'late';
            } else {
                status = 'soon';
            }

            return {
                str: `Due ${overdue ? 'earlier' : ''} today @ ${time}`,
                status,
            };

        case fullDaysAway == 0 && !overdue:
            return {
                str: `Due today @ ${time}`,
                status: completed ? 'ok' : 'soon',
            };

        case fullDaysAway == 1:
            return {
                str: `Due tomorrow @ ${time}`,
                status: 'ok',
            };

        case fullDaysAway < 7:
            return {
                str: `Due ${weekday} @ ${time}`,
                status: 'ok',
            };

        case fullDaysAway < 13:
            return {
                str: `Due next ${weekday} @ ${time}`,
                status: 'ok',
            };

        default:
            return {
                str: `Due in ${fullDaysAway} days`,
                status: 'ok',
            };
    }
}

/**
 * Formats the given start of the week date for displaying in the weekly calendar's header
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
 * Formats the given datefor displaying in the daily calendar's header
 *
 * Returns in the form Weekday, Month DD, YYYY
 */
export function formatCalendarDailyRange(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Formats the date for displaying in the header of a day on the calendar
 *
 * Returns in the form Weekday MM/DD
 */
export function formatCalendarWeeklyDate(date: Date): string {
    return date
        .toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
        })
        .replace(',', '');
}

/**
 * Formats the time range
 *
 * Returns in the form HH:MM AM/PM - HH:MM AM/PM
 */
export function formatCourseTimeRange(start: Date, end: Date): string {
    return `${formatTime(start)} — ${formatTime(end)}`;
}

/**
 * Formats the array of day indices into a string of abbreviated days, space separated
 */
export function formatCourseTimeDays(days: number[]): string {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days.map((day) => weekdays[day]).join(' ');
}
