import { primary, secondary } from '.';
import { CalendarDay } from './CalendarDay';
import { CalendarCell } from './CalendarCell';
import { range } from '@/lib/utils';
import {
    daysAhead,
    formatCalendarWeeklyDate,
    formatTime,
    isSameDay,
} from '@/lib/date';
import { type CalendarController } from '@/lib/hooks/useCalendarController';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';

type CalendarWeekBodyProps = {
    controller: CalendarController;

    /** How many days to display */
    days: number;

    /** Hide the weekday label above each day (ex: Mon 1/24) */
    hideWeekdayLabel?: boolean;
};

export function CalendarWeekBody(props: CalendarWeekBodyProps) {
    const days = range(0, props.days);
    const times = range(0, 24);

    return (
        <Box overflow='auto' pos='relative' ref={props.controller.scrollRef}>
            {/* weekday labels */}
            {!props.hideWeekdayLabel && (
                <Grid
                    pos='sticky'
                    top='0'
                    bg='bg.750'
                    templateColumns='5rem'
                    autoColumns='1fr'
                    autoFlow='column'
                    borderBottom='1px'
                    borderColor={primary}
                    zIndex='calendar.weekdayLabel'
                >
                    <CalendarCell />

                    {days.map((day) => {
                        const date = daysAhead(
                            props.controller.calendarStart,
                            day
                        );
                        const isToday = isSameDay(date, props.controller.now);

                        return (
                            <CalendarCell
                                key={day}
                                text={formatCalendarWeeklyDate(date)}
                                textVariant='h3'
                                textColor={isToday ? 'accent.500' : undefined}
                                pl='0.5rem'
                                align='center'
                                borderLeft='1px'
                                borderColor={primary}
                            />
                        );
                    })}
                </Grid>
            )}

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

                {days.map((day) => {
                    const date = daysAhead(props.controller.calendarStart, day);
                    const isToday = isSameDay(date, props.controller.now);

                    return (
                        <CalendarDay
                            key={day}
                            controller={props.controller}
                            date={date}
                            isToday={isToday}
                        />
                    );
                })}

                {/* current time */}
                <Flex
                    w='full'
                    pos='absolute'
                    align='center'
                    top={`${props.controller.heightOf(props.controller.now)}px`}
                    zIndex='calendar.time'
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
