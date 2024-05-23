import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { Plus } from './icons';

export function AddButton(props: IconButtonProps) {
    return (
        <IconButton
            icon={<Plus color='dark' size={20} />}
            size='sm'
            rounded='full'
            colorScheme='accent'
            {...props}
        />
    );
}
