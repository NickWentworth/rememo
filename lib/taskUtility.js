import { DueDate } from './classes/dueDate.js';

const msPerDay = 1000 * 60 * 60 * 24; // calculate number of milliseconds per day

export const emptyTask = {
    name: '',
    class: '',
    description: '',
    dueDate: '',
    dueTime: '',
    progress: 0
}

export function getFormattedDueDateString(task) {
    return task.dueDate + (task.dueTime ? ' @ ' : '') + task.dueTime;
}
