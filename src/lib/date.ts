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
