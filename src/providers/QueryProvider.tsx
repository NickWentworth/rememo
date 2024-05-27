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
import { useToast } from '@chakra-ui/react';

export function QueryProvider(props: React.PropsWithChildren) {
    // query provider must be a child of ChakraProvider to send toasts
    const toast = useToast();

    // react query client
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: Infinity, retry: false },
                },
                mutationCache: new MutationCache({
                    onError: (error) =>
                        toast({
                            title: error.name,
                            description: error.message,
                            status: 'error',
                            isClosable: true,
                        }),
                }),
                queryCache: new QueryCache({
                    onError: (error) =>
                        toast({
                            description: error.message,
                            status: 'error',
                            isClosable: true,
                        }),
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
