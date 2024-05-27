'use client';

import { Icon } from '@/components/Icon';
import { Panel, PanelBody, PanelHeader } from '@/components/panel';
import { trpc } from '@/lib/trpc/client';
import { signOut } from 'next-auth/react';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Flex,
    Stack,
    Text,
    Tooltip,
} from '@chakra-ui/react';

export default function SettingsPage() {
    const { data: user, status } = trpc.user.get.useQuery();
    const { mutate: deleteUser } = trpc.user.permanentlyDelete.useMutation();

    function onDeleteClick() {
        if (
            confirm(
                'Are you sure you want to delete your account?\nThis action is irreversible and all data will be permanently deleted.'
            )
        ) {
            deleteUser();
            signOut();
        }
    }

    return (
        <Panel flex={1}>
            <PanelHeader>
                <Text variant='h1'>Settings</Text>
            </PanelHeader>

            {/* TODO: refactor PanelBody to allow its use for a single element */}
            <PanelBody
                data={user}
                ifExists={(user) => (
                    <>
                        <Flex gap='1rem'>
                            <Tooltip
                                label='Profile picture and name must be changed through your Google profile'
                                w='200px'
                                textAlign='center'
                                rounded='lg'
                            >
                                <Flex
                                    alignSelf='start'
                                    align='center'
                                    gap='0.5rem'
                                >
                                    <Text variant='h3' alignSelf='start'>
                                        User Profile
                                    </Text>

                                    <Icon
                                        icon='info'
                                        variant='white'
                                        fontSize='xl'
                                    />
                                </Flex>
                            </Tooltip>

                            <Avatar
                                size='xl'
                                src={user.image ?? undefined}
                                name={user.name ?? undefined}
                            />

                            <Box alignSelf='center'>
                                <Text variant='h4'>{user.name}</Text>
                                <Text>{user.email}</Text>
                            </Box>
                        </Flex>

                        <Divider />

                        <Stack align='start'>
                            <Button
                                colorScheme='accent'
                                variant='outline'
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </Button>

                            <Button colorScheme='red' onClick={onDeleteClick}>
                                Delete Account
                            </Button>
                        </Stack>
                    </>
                )}
                ifUndefined={[[status === 'pending', <Text>Loading...</Text>]]}
            />
        </Panel>
    );
}
