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

// TODO: implement term date formatting
export function formatTermDate(start: Date, end: Date): string {
    return `${dateISO(start)} - ${dateISO(end)}`;
}

// TODO: implement task date formatting
export function formatTaskDate(due: Date): string {
    return 'Due ' + due.toUTCString();
}

export function formatSubtaskDate(due: Date): string {
    // remove "due" from formatted task date, everything else remains the same
    const tokens = formatTaskDate(due).split(' ');
    tokens.shift();
    return tokens.join(' ');
}
