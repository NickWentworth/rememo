import { Icon } from '@/components/Icon';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

export function AddButton(props: IconButtonProps) {
    return (
        <IconButton
            icon={<Icon icon='plus' variant='dark' fontSize='xl' />}
            size='sm'
            rounded='full'
            colorScheme='accent'
            {...props}
        />
    );
}
