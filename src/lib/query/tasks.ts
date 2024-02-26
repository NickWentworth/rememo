'use client';

import {
    GetTaskOptions,
    createTask,
    deleteTask,
    getPaginatedTasks,
    setSubtaskCompletion,
    setTaskCompletion,
    updateTask,
} from '../actions/tasks';
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

const TASK_KEY = 'tasks';

/**
 * Returns an query object that is filtered based on the given options
 *
 * To use the data, access the included `tasks` property that is returned
 */
export function useTasksWithOptions(options: GetTaskOptions) {
    const query = useInfiniteQuery({
        queryKey: [TASK_KEY, JSON.stringify(options)],
        queryFn: ({ pageParam }) =>
            getPaginatedTasks({ ...options, page: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.next,
    });

    return {
        query,
        tasks: query.data?.pages.flatMap((page) => page.tasks) ?? [],
    };
}

/**
 * Exposes backend task operations for the frontend to use:
 * - Usual `create`, `update`, and `delete` methods
 * - `setTaskCompletion` to just change the completion state of a task
 * - `setSubtaskCompletion` to just change the completion state of a subtask
 */
export function useTaskMutations() {
    const qc = useQueryClient();

    const { mutate: create } = useMutation({
        mutationFn: createTask,
        onSuccess: () => qc.invalidateQueries({ queryKey: [TASK_KEY] }),
    });

    const { mutate: update } = useMutation({
        mutationFn: updateTask,
        onSuccess: () => qc.invalidateQueries({ queryKey: [TASK_KEY] }),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => qc.invalidateQueries({ queryKey: [TASK_KEY] }),
    });

    // TODO: look into optimistic updates for setting completion

    // TODO: probably don't need to refetch everything when only setting completion

    const { mutate: taskComp } = useMutation({
        mutationFn: (v: { id: string; completed: boolean }) =>
            setTaskCompletion(v.id, v.completed),
        onSuccess: () => qc.invalidateQueries({ queryKey: [TASK_KEY] }),
    });

    const { mutate: subtaskComp } = useMutation({
        mutationFn: (v: { id: string; completed: boolean }) =>
            setSubtaskCompletion(v.id, v.completed),
        onSuccess: () => qc.invalidateQueries({ queryKey: [TASK_KEY] }),
    });

    return {
        create,
        update,
        remove,
        setTaskCompletion: taskComp,
        setSubtaskCompletion: subtaskComp,
    };
}
