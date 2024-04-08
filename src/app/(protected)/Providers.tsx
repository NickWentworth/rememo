'use client';

import { ToastProvider } from './ToastProvider';
import { trpc, trpcTransformer } from '@/lib/trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';

export default function Providers(props: React.PropsWithChildren) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: { queries: { staleTime: Infinity } },
            })
    );

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
                <ToastProvider>{props.children}</ToastProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}
