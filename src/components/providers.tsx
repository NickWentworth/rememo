'use client';

import { CoursePayload, TaskPayload, TermPayload } from '@/lib/types';
import { ReactNode, createContext, useContext } from 'react';

type ProviderData<T> = {
    // this data should be immutable, changes will cause path revalidation to update data
    data: readonly T[];
    get: (id: string) => T | undefined;
};

type ProviderProps<T> = {
    data: T[];
    children?: ReactNode;
};

// TODO: this is all super repetitive, introduce more generics to reduce this code

//  ------------------------------ term context ------------------------------ //

const TermDataContext = createContext<ProviderData<TermPayload> | undefined>(
    undefined
);

export function useTermData(): ProviderData<TermPayload> {
    const context = useContext(TermDataContext);
    if (context === undefined) {
        throw new Error('Term data is not available to this component!');
    }
    return context;
}

export function TermProvider(props: ProviderProps<TermPayload>) {
    const data = {
        data: props.data,
        get: (id) => props.data.find((term) => term.id == id),
    } satisfies ProviderData<TermPayload>;

    return (
        <TermDataContext.Provider value={data}>
            {props.children}
        </TermDataContext.Provider>
    );
}

//  ------------------------------ course context ------------------------------ //

const CourseDataContext = createContext<
    ProviderData<CoursePayload> | undefined
>(undefined);

export function useCourseData(): ProviderData<CoursePayload> {
    const context = useContext(CourseDataContext);
    if (context === undefined) {
        throw new Error('Course data is not available to this component!');
    }
    return context;
}

export function CourseProvider(props: ProviderProps<CoursePayload>) {
    const data = {
        data: props.data,
        get: (id) => props.data.find((course) => course.id == id),
    } satisfies ProviderData<CoursePayload>;

    return (
        <CourseDataContext.Provider value={data}>
            {props.children}
        </CourseDataContext.Provider>
    );
}

//  ------------------------------ task context ------------------------------ //

const TaskDataContext = createContext<ProviderData<TaskPayload> | undefined>(
    undefined
);

export function useTaskData(): ProviderData<TaskPayload> {
    const context = useContext(TaskDataContext);
    if (context === undefined) {
        throw new Error('Task data is not available to this component!');
    }
    return context;
}

export function TaskProvider(props: ProviderProps<TaskPayload>) {
    const data = {
        data: props.data,
        get: (id) => props.data.find((task) => task.id == id),
    } satisfies ProviderData<TaskPayload>;

    return (
        <TaskDataContext.Provider value={data}>
            {props.children}
        </TaskDataContext.Provider>
    );
}
