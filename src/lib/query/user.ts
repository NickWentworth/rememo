'use client';

import { getUserOrThrow } from '../actions/user';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUserOrThrow(),
    });
}
