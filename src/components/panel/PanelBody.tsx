import { Box, LayoutProps, Stack } from '@chakra-ui/react';

type PanelProps<T> = {
    data?: T[];
    ifExists?: (t: T[]) => React.ReactNode;
    ifUndefined: [boolean, React.ReactNode][];

    /** Max width for each item in the list to be, if undefined, items fill width */
    maxW?: LayoutProps['maxW'];
};

export function PanelBody<T>(props: PanelProps<T>) {
    return (
        <Box flex='1' p='1rem' overflow='hidden'>
            <Stack maxW={props.maxW} h='100%' margin='auto' overflow='auto'>
                {getNode(props)}
            </Stack>
        </Box>
    );
}

function getNode<T>(props: PanelProps<T>) {
    if (props.data) {
        return props.ifExists?.(props.data);
    } else {
        return props.ifUndefined.find(([bool, _]) => bool)?.at(1);
    }
}
