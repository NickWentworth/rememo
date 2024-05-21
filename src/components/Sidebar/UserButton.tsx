import { trpc } from '@/lib/trpc/client';
import { Link } from '@chakra-ui/next-js';
import { Avatar, Flex, IconButton, Spinner, Text } from '@chakra-ui/react';

type UserButtonProps = {
    expanded: boolean;
};

export function UserButton(props: UserButtonProps) {
    const { data: user } = trpc.user.get.useQuery();

    return (
        <Link href='/settings'>
            <IconButton
                size='lg'
                variant='ghost'
                w='100%'
                justifyContent='start'
                px='0.5rem'
                icon={
                    user ? (
                        <Flex align='center' gap='0.5rem'>
                            <Avatar
                                size='sm'
                                src={user.image ?? undefined}
                                name={user.name ?? undefined}
                            />

                            {props.expanded && (
                                <Text variant='h4'>{user.name}</Text>
                            )}
                        </Flex>
                    ) : (
                        <Spinner size='lg' color='accent.500' />
                    )
                }
                aria-label='user'
            />
        </Link>
    );
}
