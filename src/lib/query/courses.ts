import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CoursePayload } from '../types';
import {
    createCourse,
    deleteCourse,
    getCoursesByTermId,
    updateCourse,
} from '../actions/courses';

const COURSE_KEY = 'courses';

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
