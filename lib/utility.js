const locale = 'en-US';
const msPerDay = 1000 * 60 * 60 * 24; // calculate number of milliseconds per day

export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getFormattedDueDateString(dueString) {
    let due = new Date(dueString);
    let today = new Date();

    let daysAway = (due.getTime() - today.getTime()) / msPerDay;
    
    let roundedDays = (daysAway + 0.5).toFixed(0); // round up

    // idea for range-based switch statement from https://stackoverflow.com/questions/5619832/switch-on-ranges-of-integers-in-javascript
    let phrase = '';
    switch (true) {
        case (roundedDays == 1):
            phrase = 'today';
            break;
        case (roundedDays == 2):
            phrase = 'tomorrow';
            break;
        case (roundedDays < 7):
            phrase = 'this ' + due.toLocaleDateString(locale, { weekday: 'long' });
            break;
        case (roundedDays < 14):
            phrase = 'next '+ due.toLocaleDateString(locale, { weekday: 'long' });
            break;
        default:
            phrase = due.toLocaleDateString(locale, {
                month: 'long',
                day: '2-digit'
            })
            break;
    }

    let time = due.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    })
    
    return 'Due ' + phrase + ' - ' + time.toLowerCase().replace(' ', '');
}
