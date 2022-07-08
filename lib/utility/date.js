import { plural } from './general';

// general date utility functions

const locale = 'en-US'; // for date and time formatting
const msPerDay = 1000 * 60 * 60 * 24; // calculate number of milliseconds per day

const lateColor = 'var(--warning)';

// returns a date in the form 'January 2000'
export function getTermFormattedDate(dateString) {
    let date = new Date(dateString);

    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

// returns a date and time relative to how far in the future it is due
// also can return a color if overdue or soon due
export function getTaskFormattedDate(dateString, timeString) {
    // get due and today as dates
    let due = new Date(`${dateString}T${timeString || '23:59'}:00`);
    let today = new Date();
    
    let weekday = due.toLocaleDateString(locale, { weekday: 'long' });
    let fullDate = due.toLocaleDateString(locale, { month: 'long', day: '2-digit' });
    let formattedTime = timeString
        ? ' - ' + due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
            .replace(' ', '')
            .toLowerCase()
        : '';
    
    let overdue = due < today; // detecting if due date has already passed
    let daysAway = ((due.setHours(0, 0, 0) - today.setHours(0, 0, 0)) / msPerDay).toFixed(); // number of days from today

    // finally get formatted string
    let phrase = '';
    let color = '';
    switch (true) {
        case (daysAway <= -1):
            phrase = `Overdue by ${-daysAway} day${plural(-daysAway)}`;
            color = lateColor;
            break;
        case (daysAway <= 0 && overdue):
            phrase = `Due earlier today${formattedTime}`;
            color = lateColor;
            break;
        case (daysAway <= 0 && !overdue):
            phrase = `Due today${formattedTime}`;
            break;
        case (daysAway <= 1):
            phrase = `Due tomorrow${formattedTime}`;
            break;
        case (daysAway <= 6):
            phrase = `Due this ${weekday}${formattedTime}`;
            break;
        case (daysAway <= 13):
            phrase = `Due next ${weekday}${formattedTime}`;
            break;
        default:
            phrase = `Due ${fullDate}`;
            break;
    }

    return [phrase, color];
}
