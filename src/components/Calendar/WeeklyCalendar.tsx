'use client';

import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekBody } from './CalendarWeekBody';
import { daysAhead, formatCalendarWeeklyRange } from '@/lib/date';
import { useCalendarController } from '@/lib/hooks/useCalendarController';
import { Flex } from '@chakra-ui/react';

type WeeklyCalendarProps = {
    initialTime: number;
};

export function WeeklyCalendar(props: WeeklyCalendarProps) {
    const controller = useCalendarController({
        startDate: (now) => daysAhead(now, -now.getDay()),
        daysChanged: 7,
        initialTime: props.initialTime,
    });

    return (
        <Flex flex='1' direction='column' roundedTop='md' overflow='hidden'>
            <CalendarHeader
                controller={controller}
                title={formatCalendarWeeklyRange(controller.calendarStart)}
                buttonText='This Week'
            />

            <CalendarWeekBody controller={controller} days={7} />
        </Flex>
    );
}
