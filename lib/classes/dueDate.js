const locale = 'en-US';

// accepts dates in following form to allow an exact time to be optional
// date: fullmonth day, year <hour:minute>
// time: boolean, is a specific time given?
export class DueDate {
    constructor(dateString, time) {
        this.due = (dateString === null) ? new Date() : new Date(dateString);
        this.time = time;
    }

    ms() {
        return this.due.getTime();
    }

    weekdayFormat() {
        return this.due.toLocaleDateString(locale, { weekday: 'long' });
    }

    timeFormat() {
        return this.due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }).toLowerCase().replace(' ', '');
    }

    fullFormat() {
        let dateString = this.due.toLocaleDateString(locale, { month: 'long', day: '2-digit' }).replace(' 0', ' ');
        let timeString = this.time ? (' - ' + this.timeFormat()) : '';
        return dateString + timeString;
    }
}
