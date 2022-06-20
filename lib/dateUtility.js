const locale = 'en-US'; // for date and time formatting

export function getTermFormattedDate(dateString) {
    let date = new Date(dateString);

    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}
