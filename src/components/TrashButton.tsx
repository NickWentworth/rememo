import { Icon } from '@/components/Icon';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

export function TrashButton(props: IconButtonProps) {
    return (
        <IconButton
            icon={<Icon icon='trash' variant='white' />}
            size='xs'
            _hover={{ bg: 'red.400' }}
            {...props}
        />
    );
}
