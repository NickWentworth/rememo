import { useObjectList } from './useObjectList';

const taskApiRoute = '/api/task/';

export function useTasks() {
    const [tasks, taskFunctions] = useObjectList(taskApiRoute);

    return [tasks, taskFunctions];
}
