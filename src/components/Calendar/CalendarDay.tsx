import { primary, secondary } from '.';
import { CalendarCell } from './CalendarCell';
import { Location } from '@/components/icons';
import { formatCourseTimeRange } from '@/lib/date';
import { trpc } from '@/lib/trpc/client';
import { range } from '@/lib/utils';
import { Box, Flex, Text } from '@chakra-ui/react';

type CalendarDayProps = {
    /** Date that this calendar day is displaying */
    date: Date;

    /** How to calculate height of an event */
    heightOf: (d: Date) => number;
};

export function CalendarDay(props: CalendarDayProps) {
    // ok to do this per day because trpc batches queries
    const { data: courseTimes } = trpc.course.timesByDate.useQuery(props.date);

    const times = range(0, 24);

    return (
        <Box pos='relative' borderLeft='1px' borderColor={primary}>
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
                const start = props.heightOf(time.start);
                const end = props.heightOf(time.end);

                const top = Math.floor(start);
                const height = Math.floor(end - start) - 1;

                return (
                    <Box
                        key={time.id}
                        pos='absolute'
                        top={`${top}px`}
                        h={`${height}px`}
                        left='0'
                        right='0'
                        bg='bg.800'
                        p='0.5rem'
                        gap='0.25rem'
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
                                <Location size={14} color='light' />
                                <Text>{time.course.location}</Text>
                            </Flex>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}
