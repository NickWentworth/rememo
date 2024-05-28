import { Flex, FlexProps, Text } from '@chakra-ui/react';

type CalendarCellProps = FlexProps & {
    text?: string;
    textVariant?: string;
    textColor?: string;
};

export function CalendarCell(props: CalendarCellProps) {
    const { text, textVariant, textColor, ...boxProps } = props;

    return (
        <Flex {...boxProps} h='2rem' fontSize='xl'>
            {text && (
                <Text variant={textVariant} color={textColor}>
                    {text}
                </Text>
            )}
        </Flex>
    );
}
