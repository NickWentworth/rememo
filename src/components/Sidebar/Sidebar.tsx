'use client';

import { Icon } from '@/components/Icon';
import { PageLink } from './PageLink';
import { UserButton } from './UserButton';
import {
    Box,
    Divider,
    Flex,
    IconButton,
    Spacer,
    Stack,
    Text,
    useBoolean,
} from '@chakra-ui/react';

export const SIDEBAR_ICON_SIZE = '32px';
const LOGO_SIZE = '48px';

export function Sidebar() {
    const [expanded, { toggle: toggleExpanded }] = useBoolean(false);

    return (
        <Stack p='0.5rem' bg='bg.800' shadow='dark-lg' zIndex='sidebar'>
            <Flex align='center' gap='0.5rem'>
                <Box my='0.25rem'>
                    <Icon icon='logo' variant='accent' fontSize={LOGO_SIZE} />
                </Box>

                {expanded && <Text variant='logo'>Rememo</Text>}
            </Flex>

            <Divider />

            <Stack gap='0'>
                <PageLink
                    name='Dashboard'
                    to='/dashboard'
                    icon='dashboard'
                    expanded={expanded}
                />
                <PageLink
                    name='Tasks'
                    to='/tasks'
                    icon='tasks'
                    expanded={expanded}
                />
                <PageLink
                    name='Courses'
                    to='/courses'
                    icon='courses'
                    expanded={expanded}
                />
                <PageLink
                    name='Calendar'
                    to='/calendar'
                    icon='calendar'
                    expanded={expanded}
                />
            </Stack>

            <Spacer />

            <Stack gap='0'>
                <UserButton expanded={expanded} />

                <IconButton
                    size='lg'
                    variant='ghost'
                    justifyContent='start'
                    px='0.5rem'
                    icon={
                        <Icon icon='hamburger' fontSize={SIDEBAR_ICON_SIZE} />
                    }
                    onClick={toggleExpanded}
                    aria-label='hamburger'
                />
            </Stack>
        </Stack>
    );
}
