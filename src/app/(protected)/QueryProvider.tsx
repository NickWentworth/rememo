'use client';

import { trpc, trpcTransformer } from '@/lib/trpc/client';
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { useToastController } from './ToastProvider';

export function QueryProvider(props: React.PropsWithChildren) {
    // query provider must be a child of ToastProvider to send toasts
    const { send: sendToast } = useToastController();

    // react query client
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: Infinity, retry: false },
                },
                mutationCache: new MutationCache({
                    onError: (error) =>
                        sendToast({ msg: error.message, severity: 'error' }),
                }),
                queryCache: new QueryCache({
                    onError: (error) =>
                        sendToast({ msg: error.message, severity: 'error' }),
                }),
            })
    );

    // trpc client
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `/api/trpc`,
                    transformer: trpcTransformer,
                }),
            ],
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
