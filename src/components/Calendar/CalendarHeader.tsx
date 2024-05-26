import { Left, Right } from '../icons';
import { CalendarController } from '@/lib/hooks/useCalendarController';
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react';

type CalendarHeaderProps = {
    controller: CalendarController;

    /** Title displayed at the top of the calendar */
    title: string;

    /** Text displayed within button that returns to initial time */
    buttonText: string;
};

export function CalendarHeader(props: CalendarHeaderProps) {
    return (
        <Flex bg='bg.800' p='0.5rem' align='center' gap='0.5rem'>
            <Button
                onClick={props.controller.onTodayClick}
                variant='outline'
                colorScheme='accent'
            >
                {props.buttonText}
            </Button>

            <Box>
                <IconButton
                    icon={<Left color='white' size={30} />}
                    onClick={props.controller.onPrevClick}
                    variant='ghost'
                    colorScheme='accent'
                    aria-label='back'
                />

                <IconButton
                    icon={<Right color='white' size={30} />}
                    onClick={props.controller.onNextClick}
                    variant='ghost'
                    colorScheme='accent'
                    aria-label='next'
                />
            </Box>

            <Text variant='h1'>{props.title}</Text>
        </Flex>
    );
}
