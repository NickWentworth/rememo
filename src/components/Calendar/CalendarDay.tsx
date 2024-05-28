import { primary, secondary } from '.';
import { CalendarCell } from './CalendarCell';
import { Icon } from '@/components/Icon';
import { formatCourseTimeRange, isBetweenTimes } from '@/lib/date';
import { CalendarController } from '@/lib/hooks/useCalendarController';
import { trpc } from '@/lib/trpc/client';
import { range } from '@/lib/utils';
import { Box, Flex, Text } from '@chakra-ui/react';

type CalendarDayProps = {
    controller: CalendarController;

    /** Date that this calendar day is displaying */
    date: Date;

    /** Is this calendar day today? */
    isToday?: boolean;
};

export function CalendarDay(props: CalendarDayProps) {
    // ok to do this per day because trpc batches queries
    const { data: courseTimes } = trpc.course.timesByDate.useQuery(props.date);

    const times = range(0, 24);

    return (
        <Box
            pos='relative'
            borderLeft='1px'
            borderColor={primary}
            bg={props.isToday ? 'accent.alpha20' : undefined}
        >
            {/* regular time cells */}
            {times.flatMap((h) => {
                const hour = new Date();
                hour.setUTCHours(h, 0, 0, 0);

                return [
                    <CalendarCell
                        key={`${h}a`}
                        borderBottom='1px'
                        borderColor={secondary}
                    />,

                    <CalendarCell
                        key={`${h}b`}
                        borderBottom='1px'
                        borderColor={primary}
                    />,
                ];
            })}

            {/* course time cards */}
            {courseTimes?.map((time) => {
                const start = props.controller.heightOf(time.start);
                const end = props.controller.heightOf(time.end);

                const top = Math.floor(start);
                const height = Math.floor(end - start) - 1;

                const isActive =
                    props.isToday &&
                    isBetweenTimes(props.controller.now, time.start, time.end);

                return (
                    <Box
                        key={time.id}
                        pos='absolute'
                        top={`${top}px`}
                        h={`${height}px`}
                        left='0'
                        right='0'
                        bg='bg.800'
                        p='0.25rem'
                        gap='0.25rem'
                        borderWidth='2px'
                        borderColor={isActive ? 'accent.500' : 'transparent'}
                        zIndex='calendar.event'
                    >
                        <Text
                            variant='h3'
                            color={time.course.color}
                            textOverflow='ellipsis'
                            whiteSpace='nowrap'
                            overflowX='hidden'
                        >
                            {time.course.name}
                        </Text>

                        <Text color='bg.50'>
                            {formatCourseTimeRange(time.start, time.end)}
                        </Text>

                        {time.course.location && (
                            <Flex align='center' gap='0.25rem'>
                                <Icon
                                    icon='location'
                                    variant='light'
                                    fontSize='sm'
                                />
                                <Text>{time.course.location}</Text>
                            </Flex>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
