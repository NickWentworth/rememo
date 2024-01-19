'use client';

import { TaskPayload } from '@/lib/types';
import { createContext, useContext } from 'react';

type TaskProviderData = {
    data: readonly TaskPayload[];
};

const TaskContext = createContext<TaskProviderData | undefined>(undefined);

type TaskProviderProps = {
    tasks: TaskPayload[];
    children: React.ReactNode;
};

export default function TaskProvider(props: TaskProviderProps) {
    const data = {
        data: props.tasks,
    } satisfies TaskProviderData;

    return (
        <TaskContext.Provider value={data}>
            {props.children}
        </TaskContext.Provider>
    );
}

export function useTasks(): TaskProviderData {
    const context = useContext(TaskContext);

    if (context === undefined) {
        throw new Error('Task data is not accessible to this component!');
    }

    return context;
}
