import { DueDate } from './classes/dueDate.js';

const msPerDay = 1000 * 60 * 60 * 24; // calculate number of milliseconds per day
export const defaultDueTime = '23:59'; // default due time set when adding a task

export const emptyTask = {
    name: '',
    class: '',
    description: '',
    dueDate: '',
    dueTime: defaultDueTime,
    progress: 0
}

export function getFormattedDueDateString(task) {
    return `dueDate: ${task.dueDate}, dueTime: ${task.dueTime || 'none'}`;
}
