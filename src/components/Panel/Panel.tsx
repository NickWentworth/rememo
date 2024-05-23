import { Flex } from '@chakra-ui/react';

type PanelProps = React.PropsWithChildren<{
    flex: number;
}>;

export function Panel(props: PanelProps) {
    return (
        <Flex flex={props.flex} direction='column' overflow='hidden'>
            {props.children}
        </Flex>
    );
}
