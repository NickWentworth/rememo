'use client';

import { TermPayload } from '@/lib/types';
import { createContext, useContext } from 'react';

type TermProviderData = {
    data: readonly TermPayload[];
};

const TermContext = createContext<TermProviderData | undefined>(undefined);

type TermProviderProps = {
    terms: TermPayload[];
    children: React.ReactNode;
};

export default function TermProvider(props: TermProviderProps) {
    const data = {
        data: props.terms,
    } satisfies TermProviderData;

    return (
        <TermContext.Provider value={data}>
            {props.children}
        </TermContext.Provider>
    );
}

export function useTerms(): TermProviderData {
    const context = useContext(TermContext);

    if (context === undefined) {
        throw new Error('Term data is not accessible to this component!');
    }

    return context;
}
