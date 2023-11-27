// TODO: implement task date formatting
export function formatTaskDate(due: Date): string {
    return 'Due ' + due.toUTCString();
}
