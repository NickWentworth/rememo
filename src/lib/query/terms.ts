'use client';

import {
    createTerm,
    deleteTerm,
    getTermById,
    getTerms,
    updateTerm,
} from '../actions/terms';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TermPayload } from '../types';

const TERM_KEY = 'terms';

/**
 * Returns a query object for all terms that a user owns
 */
export function useAllTerms() {
    return useQuery({
        queryKey: [TERM_KEY],
        queryFn: () => getTerms(),
    });
}

/**
 * Returns a query object for a single term, expected to have been fetched already
 *
 * Allows for a single update instead of entire re-fetch when a term is updated
 */
export function useInitialTerm(initial: TermPayload) {
    return useQuery({
        queryKey: [TERM_KEY, initial.id],
        queryFn: () => getTermById(initial.id),
        initialData: initial,
    });
}

/**
 * Exposes term create, update, and delete operations for the frontend to use
 *
 * Terms used from the `useTerms` and `useSingularTerm` query objects will
 * be automatically re-fetched when mutations are done
 */
export function useTermMutations() {
    const qc = useQueryClient();

    const { mutate: create } = useMutation({
        mutationFn: createTerm,
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: [TERM_KEY], exact: true }),
    });

    const { mutate: update } = useMutation({
        mutationFn: updateTerm,
        onSuccess: (_, data) =>
            qc.invalidateQueries({
                queryKey: [TERM_KEY, data.id],
                exact: true,
            }),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteTerm,
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: [TERM_KEY], exact: true }),
    });

    return {
        create,
        update,
        remove,
    };
}
