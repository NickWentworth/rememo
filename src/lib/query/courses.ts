'use client';

import {
    createCourse,
    deleteCourse,
    getCourseTimesByDates,
    getCourses,
    getCoursesByTermId,
    updateCourse,
} from '../actions/courses';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const COURSE_KEY = 'courses';

/**
 * Returns a query object for all courses that a user owns
 */
export function useAllCourses() {
    return useQuery({
        queryKey: [COURSE_KEY],
        queryFn: () => getCourses(),
    });
}

/**
 * Returns a query object for all courses linked to the given termId, if it exists
 *
 * If termId is undefined or there are no courses for the given term, data will contain an empty list
 */
export function useCoursesByTermId(termId?: string) {
    return useQuery({
        queryKey: [COURSE_KEY, termId],
        queryFn: () => {
            if (termId) {
                return getCoursesByTermId(termId);
            } else {
                return [];
            }
        },
    });
}

/**
 * Returns a single query containing a list of course times, each corresponding to a `Date` in the given list
 *
 * Backend route is designed to only return the times that happen on a specific day,
 * so any components using this hook should not need to do any filtering
 */
export function useCourseTimesByDates(dates: Date[]) {
    return useQuery({
        queryKey: [COURSE_KEY, dates.at(0), dates.length],
        queryFn: () => getCourseTimesByDates(dates),
    });
}

/**
 * Exposes course create, update, and delete operations for the frontend to access
 */
export function useCourseMutations() {
    const qc = useQueryClient();

    const { mutate: create } = useMutation({
        mutationFn: createCourse,
        onSuccess: () => qc.invalidateQueries({ queryKey: [COURSE_KEY] }),
    });

    const { mutate: update } = useMutation({
        mutationFn: updateCourse,
        onSuccess: () => qc.invalidateQueries({ queryKey: [COURSE_KEY] }),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => qc.invalidateQueries({ queryKey: [COURSE_KEY] }),
    });

    return {
        create,
        update,
        remove,
    };
}
