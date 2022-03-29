import { plural } from './utility.js';

const locale = 'en-US'; // for date and time formatting
const msPerDay = 1000 * 60 * 60 * 24; // calculate number of milliseconds per day

const lateColor = 'red';
const soonColor = 'yellow';

const defaultDueTime = '23:59'; // default due time set when adding a task

export const emptyTask = {
    name: '',
    class: '',
    description: '',
    dueDate: '',
    dueTime: defaultDueTime,
    progress: 0
}

// returns the ISO-format of a given task's date (YYYY-MM-DDTHH:MM:SS)
export function getISO(task) {
    return `${task.dueDate}T${task.dueTime || '23:59'}:00`;
}

// returns an string corresponding to how far away the task is due
// assuming tasks are already sorted, will signal when to insert new divider
export function getTimeDivider(task) {
    // get due and today as dates
    let due = new Date(getISO(task));
    let today = new Date();
        
    let overdue = due < today; // detecting if due date has already passed
    let daysAway = ((due.setHours(0, 0, 0) - today.setHours(0, 0, 0)) / msPerDay).toFixed(); // number of days from today

    let divider = -1;
    switch (true) {
        case (daysAway <= 0):
            divider = overdue ? 'Overdue' : 'Due Today';
            break;
        case (daysAway <= 6):
            divider = 'Due Within 1 Week';
            break;
        case (daysAway <= 13):
            divider = 'Due Within 2 Weeks';
            break;
        default:
            divider = 'Over 2 Weeks Away';
            break;
    }
    return divider;
} 

// returns a nicely formatted due string for tasks and a color if close to or over deadline
export function getFormattedDueString(task) {
    // get due and today as dates
    let due = new Date(getISO(task));
    let today = new Date();
    
    let weekday = due.toLocaleDateString(locale, { weekday: 'long' });
    let fullDate = due.toLocaleDateString(locale, { month: 'long', day: '2-digit' });
    let formattedTime = task.dueTime ? ' - ' + due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }).replace(' ', '').toLowerCase() : '';
    
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
            color = soonColor;
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
