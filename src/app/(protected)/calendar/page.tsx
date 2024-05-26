import { WeeklyCalendar } from '@/components/Calendar';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import { buildMetadata } from '@/lib/metadata';
import { Text } from '@chakra-ui/react';

export const metadata = buildMetadata({ title: 'Calendar' });

export default function CalendarPage() {
    return (
        <Panel flex={1}>
            <PanelHeader>
                <Text variant='h1'>Calendar</Text>
            </PanelHeader>

            <PanelBody>
                <WeeklyCalendar initialTime={7} />
            </PanelBody>
        </Panel>
    );
}
