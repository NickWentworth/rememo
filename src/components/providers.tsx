'use client';

import { Course, Task, Term } from '@prisma/client';
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

const TermDataContext = createContext<ProviderData<Term> | undefined>(
    undefined
);

export function useTermData(): ProviderData<Term> {
    const context = useContext(TermDataContext);
    if (context === undefined) {
        throw new Error('Term data is not available to this component!');
    }
    return context;
}

export function TermProvider(props: ProviderProps<Term>) {
    const data = {
        data: props.data,
        get: (id) => props.data.find((term) => term.id == id),
    } satisfies ProviderData<Term>;

    return (
        <TermDataContext.Provider value={data}>
            {props.children}
        </TermDataContext.Provider>
    );
}

//  ------------------------------ course context ------------------------------ //

const CourseDataContext = createContext<ProviderData<Course> | undefined>(
    undefined
);

export function useCourseData(): ProviderData<Course> {
    const context = useContext(CourseDataContext);
    if (context === undefined) {
        throw new Error('Course data is not available to this component!');
    }
    return context;
}

export function CourseProvider(props: ProviderProps<Course>) {
    const data = {
        data: props.data,
        get: (id) => props.data.find((course) => course.id == id),
    } satisfies ProviderData<Course>;

    return (
        <CourseDataContext.Provider value={data}>
            {props.children}
        </CourseDataContext.Provider>
    );
}

//  ------------------------------ task context ------------------------------ //

const TaskDataContext = createContext<ProviderData<Task> | undefined>(
    undefined
);

export function useTaskData(): ProviderData<Task> {
    const context = useContext(TaskDataContext);
    if (context === undefined) {
        throw new Error('Task data is not available to this component!');
    }
    return context;
}

export function TaskProvider(props: ProviderProps<Task>) {
    const data = {
        data: props.data,
        get: (id) => props.data.find((task) => task.id == id),
    } satisfies ProviderData<Task>;

    return (
        <TaskDataContext.Provider value={data}>
            {props.children}
        </TaskDataContext.Provider>
    );
}
