'use client';

import { ToastProvider } from './ToastProvider';
import { QueryProvider } from './QueryProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';

export default function Providers(props: React.PropsWithChildren) {
    return (
        <ChakraProvider theme={theme}>
            <ToastProvider>
                <QueryProvider>{props.children}</QueryProvider>
            </ToastProvider>
        </ChakraProvider>
    );
}
