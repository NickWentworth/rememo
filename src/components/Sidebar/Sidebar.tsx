'use client';

import { Calendar, Courses, Dashboard, Hamburger, Logo, Tasks } from '../icons';
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

export const SIDEBAR_ICON_SIZE = 32;
const LOGO_SIZE = SIDEBAR_ICON_SIZE + 16;

export function Sidebar() {
    const [expanded, { toggle: toggleExpanded }] = useBoolean(false);

    return (
        <Stack p='0.5rem' bg='bg.800' shadow='dark-lg' zIndex='sidebar'>
            <Flex align='center' gap='0.5rem'>
                <Box my='0.25rem'>
                    <Logo color='accent' size={LOGO_SIZE} />
                </Box>

                {expanded && <Text variant='logo'>Rememo</Text>}
            </Flex>

            <Divider />

            <Stack gap='0'>
                <PageLink
                    name='Dashboard'
                    to='/dashboard'
                    icon={Dashboard}
                    expanded={expanded}
                />
                <PageLink
                    name='Tasks'
                    to='/tasks'
                    icon={Tasks}
                    expanded={expanded}
                />
                <PageLink
                    name='Courses'
                    to='/courses'
                    icon={Courses}
                    expanded={expanded}
                />
                <PageLink
                    name='Calendar'
                    to='/calendar'
                    icon={Calendar}
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
                    icon={<Hamburger color='white' size={SIDEBAR_ICON_SIZE} />}
                    onClick={toggleExpanded}
                    aria-label='hamburger'
                />
            </Stack>
        </Stack>
    );
}
