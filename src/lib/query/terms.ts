'use client';

import { createTerm, deleteTerm, getTerms, updateTerm } from '../actions/terms';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
 * Exposes term create, update, and delete operations for the frontend to use
 */
export function useTermMutations() {
    const qc = useQueryClient();

    const { mutate: create } = useMutation({
        mutationFn: createTerm,
        onSuccess: () => qc.invalidateQueries({ queryKey: [TERM_KEY] }),
    });

    const { mutate: update } = useMutation({
        mutationFn: updateTerm,
        onSuccess: () => qc.invalidateQueries({ queryKey: [TERM_KEY] }),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteTerm,
        onSuccess: () => qc.invalidateQueries({ queryKey: [TERM_KEY] }),
    });

    return {
        create,
        update,
        remove,
    };
}
