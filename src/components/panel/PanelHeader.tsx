import { Flex } from '@chakra-ui/react';

export function PanelHeader(props: React.PropsWithChildren) {
    return (
        <Flex
            bg='bg.800'
            h='4rem'
            align='center'
            px='1rem'
            gap='0.5rem'
            shadow='md'
        >
            {props.children}
        </Flex>
    );
}
