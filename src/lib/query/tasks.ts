'use client';

import {
    GetTaskOptions,
    createTask,
    deleteTask,
    getTasks,
    setSubtaskCompletion,
    setTaskCompletion,
    updateTask,
} from '../actions/tasks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const TASK_KEY = 'tasks';

/**
 * Returns a query object for all tasks that a user owns
 */
export function useTasksWithOptions(options: GetTaskOptions) {
    return useQuery({
        queryKey: [TASK_KEY, JSON.stringify(options)],
        queryFn: () => getTasks(options),
    });
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
