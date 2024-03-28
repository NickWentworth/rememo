import { type AppRouter } from '.';
import { TRPCCombinedDataTransformer } from '@trpc/server';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>({
    overrides: {
        useMutation: {
            onSuccess: async (options) => {
                // apply original function
                await options.originalFn();

                // TODO: might want to create hooks to prevent needless fetches
                // automatically invalidate ALL queries on successful mutation
                options.queryClient.invalidateQueries();
            },
        },
    },
});

const serialize = (object: any) => JSON.stringify(object);

// revive date strings back into Date objects
const deserialize = (object: any) =>
    JSON.parse(object, (_k, v) => {
        const dateRE = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;

        if (typeof v === 'string' && dateRE.test(v)) {
            return new Date(v);
        } else {
            return v;
        }
    });

export const trpcTransformer: TRPCCombinedDataTransformer = {
    input: { serialize, deserialize },
    output: { serialize, deserialize },
};
