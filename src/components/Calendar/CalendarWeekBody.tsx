import { primary, secondary } from '.';
import { CalendarDay } from './CalendarDay';
import { CalendarCell } from './CalendarCell';
import { range } from '@/lib/utils';
import { daysAhead, formatCalendarWeeklyDate, formatTime } from '@/lib/date';
import { type CalendarController } from '@/lib/hooks/useCalendarController';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';

type CalendarWeekBodyProps = {
    controller: CalendarController;

    /** How many days to display */
    days: number;
};

export function CalendarWeekBody(props: CalendarWeekBodyProps) {
    const days = range(0, props.days);
    const times = range(0, 24);

    return (
        <Box overflow='auto' pos='relative' ref={props.controller.scrollRef}>
            {/* weekday labels */}
            <Grid
                pos='sticky'
                top='0'
                bg='bg.750'
                zIndex='1' // to appear on top of other columns
                templateColumns='5rem'
                autoColumns='1fr'
                autoFlow='column'
                borderBottom='1px'
                borderColor={primary}
            >
                <CalendarCell />

                {days.map((day) => (
                    <CalendarCell
                        key={day}
                        text={formatCalendarWeeklyDate(
                            daysAhead(props.controller.calendarStart, day)
                        )}
                        textVariant='h3'
                        pl='0.5rem'
                        align='center'
                        borderLeft='1px'
                        borderColor={primary}
                    />
                ))}
            </Grid>

            {/* main day columns */}
            <Grid
                pos='relative'
                templateColumns='5rem'
                autoColumns='1fr'
                autoFlow='column'
                ref={props.controller.bodyRef}
            >
                <Box>
                    {times.flatMap((h) => {
                        const hour = new Date();
                        hour.setUTCHours(h, 0, 0, 0);

                        return [
                            <CalendarCell
                                key={`${h}time`}
                                text={formatTime(hour)}
                                borderBottom='1px'
                                borderColor={secondary}
                            />,

                            <CalendarCell
                                key={`${h}empty`}
                                borderBottom='1px'
                                borderColor={primary}
                            />,
                        ];
                    })}
                </Box>

                {days.map((day) => (
                    <CalendarDay
                        key={day}
                        date={daysAhead(props.controller.calendarStart, day)}
                        heightOf={props.controller.heightOf}
                    />
                ))}

                {/* current time */}
                <Flex
                    w='full'
                    pos='absolute'
                    align='center'
                    top={`${props.controller.heightOf(props.controller.now)}px`}
                    zIndex='10'
                    translateY='-50%'
                    transform='auto'
                >
                    <Text
                        bg='accent.500'
                        color='bg.800'
                        fontWeight='bold'
                        p='0.25rem'
                        rounded='sm'
                    >
                        {formatTime(props.controller.now)}
                    </Text>

                    <Box bg='accent.500' h='3px' flex='1' />
                </Flex>
            </Grid>
        </Box>
    );
}
