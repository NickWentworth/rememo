import { buildMetadata } from '@/lib/metadata';
import { Button, Link, Stack, Text } from '@chakra-ui/react';

export const metadata = buildMetadata({
    title: 'Not Found',
});

export default async function NotFoundPage() {
    return (
        <Stack
            w='100dvw'
            h='100dvh'
            bg='bg.750'
            align='center'
            justify='center'
            gap='1rem'
        >
            <Text variant='h1'>404 - Page not found</Text>

            <Text>
                The page you are looking for doesn't exist or it might have been
                removed
            </Text>

            <Link href='/dashboard'>
                <Button colorScheme='accent'>Return to Dashboard</Button>
            </Link>
        </Stack>
    );
}
