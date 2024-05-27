'use client';

import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekBody } from './CalendarWeekBody';
import { formatCalendarDailyRange } from '@/lib/date';
import { useCalendarController } from '@/lib/hooks/useCalendarController';
import { Flex } from '@chakra-ui/react';

type DailyCalendarProps = {
    initialTime: number;
};

export function DailyCalendar(props: DailyCalendarProps) {
    const controller = useCalendarController({
        startDate: (now) => now,
        daysChanged: 1,
        initialTime: props.initialTime,
    });

    return (
        <Flex flex='1' direction='column' roundedTop='md' overflow='hidden'>
            <CalendarHeader
                controller={controller}
                title={formatCalendarDailyRange(controller.calendarStart)}
                buttonText='Today'
            />

            <CalendarWeekBody
                controller={controller}
                days={1}
                hideWeekdayLabel
            />
        </Flex>
    );
}
