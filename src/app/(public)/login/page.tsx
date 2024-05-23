import { Logo } from '@/components/icons';
import { ProviderButton } from '@/components/ProviderButton';
import { buildMetadata } from '@/lib/metadata';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getProviders } from 'next-auth/react';
import {
    AbsoluteCenter,
    Box,
    Card,
    CardBody,
    Divider,
    Stack,
    Text,
} from '@chakra-ui/react';

const LOGO_SIZE = 64;

export const metadata = buildMetadata({ title: 'Login' });

export default async function Login() {
    // reroute if user is already signed in
    if (await isAuthenticated()) {
        return redirect('/dashboard');
    }

    const authProviders = await getProviders();

    return (
        <Box w='100dvw' h='100dvh' bg='bg.750'>
            <AbsoluteCenter>
                <Card size='lg'>
                    <CardBody>
                        <Stack align='center' gap='1rem'>
                            <Logo size={LOGO_SIZE} color='accent' />

                            <Text variant='h2'>Sign in to access Rememo</Text>

                            <Divider />

                            <Stack>
                                {authProviders ? (
                                    Object.values(authProviders).map(
                                        (provider) => (
                                            <ProviderButton
                                                key={provider.id}
                                                provider={provider}
                                            />
                                        )
                                    )
                                ) : (
                                    <Text color='red.400'>
                                        Error: No auth providers were found!
                                    </Text>
                                )}
                            </Stack>
                        </Stack>
                    </CardBody>
                </Card>
            </AbsoluteCenter>
        </Box>
    );
}
