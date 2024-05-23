'use client';

import { ChakraProvider as _ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

export function ChakraProvider(props: React.PropsWithChildren) {
    return <_ChakraProvider theme={theme}>{props.children}</_ChakraProvider>;
}
