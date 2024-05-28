'use client';

import { ChakraProvider as _ChakraProvider } from '@chakra-ui/react';
import { cmm, theme } from './theme';

export function ChakraProvider(props: React.PropsWithChildren) {
    return (
        <_ChakraProvider theme={theme} colorModeManager={cmm}>
            {props.children}
        </_ChakraProvider>
    );
}
