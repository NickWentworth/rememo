import { DueDate } from './classes/dueDate.js';

const msPerDay = 1000 * 60 * 60 * 24; // calculate number of milliseconds per day

export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function plural(count) {
    return (count != 1) ? 's' : '';
}

// TODO - need to finish date formatting, likely replace string with object
export function getFormattedDueDateString(dueString) {
    let due = new DueDate(dueString, dueString.includes(':'));
    let today = new DueDate(null, true);

    let daysAway = (due.ms() - today.ms()) / msPerDay;
    let daysPast = -daysAway.toFixed();

    // idea for range-based switch statement from https://stackoverflow.com/questions/5619832/switch-on-ranges-of-integers-in-javascript
    let phrase = '';
    switch (true) {
        case (daysAway <= -1):
            phrase = 'Overdue by ' + daysPast + ' day' + plural(daysPast);
            break;
        case (daysAway <= 0):
            phrase = 'Due yesterday';
            break;
        case (daysAway < 1):
            phrase = 'Due today ' + due.timeFormat();
            break;
        case (daysAway < 2):
            phrase = 'Due tomorrow ' + due.timeFormat();
            break;
        case (daysAway < 7):
            phrase = 'Due this ' + due.weekdayFormat();
            break;
        case (daysAway < 13):
            phrase = 'Due next ' + due.weekdayFormat();
            break;
        default:
            break;
    }

    return daysAway.toFixed(6) + ' days away - ' + phrase;
}
