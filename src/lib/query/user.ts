'use client';

import { signOut } from 'next-auth/react';
import { deleteLoggedInUser, getUserOrThrow } from '../actions/user';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => getUserOrThrow(),
    });
}

export function useUserMutations() {
    const { mutate: deleteUser } = useMutation({
        mutationFn: deleteLoggedInUser,
        onSuccess: () => signOut(),
    });

    return { deleteUser };
}
