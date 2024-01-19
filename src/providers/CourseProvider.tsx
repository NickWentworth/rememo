'use client';

import { CoursePayload } from '@/lib/types';
import { createContext, useContext } from 'react';

type CourseProviderData = {
    data: readonly CoursePayload[];
    get: (id: string) => CoursePayload | undefined;
};

const CourseContext = createContext<CourseProviderData | undefined>(undefined);

type CourseProviderProps = {
    courses: CoursePayload[];
    children: React.ReactNode;
};

export default function CourseProvider(props: CourseProviderProps) {
    const data = {
        data: props.courses,
        get: (id) => props.courses.find((c) => c.id === id),
    } satisfies CourseProviderData;

    return (
        <CourseContext.Provider value={data}>
            {props.children}
        </CourseContext.Provider>
    );
}

export function useCourses(): CourseProviderData {
    const context = useContext(CourseContext);

    if (context === undefined) {
        throw new Error('Course data is not accessible to this component!');
    }

    return context;
}
