import { Icon } from '@/components/Icon';
import { IconButton, Stack, StackProps } from '@chakra-ui/react';

type CardIconProps = {
    hovering: boolean;
    iconVariant: string;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    bg?: StackProps['bg'];
};

export function CardIcons(props: CardIconProps) {
    return (
        <Stack gap='0' bg={props.bg}>
            <IconButton
                icon={
                    <Icon
                        icon='edit'
                        variant={props.iconVariant}
                        fontSize='2xl'
                    />
                }
                onClick={props.onEditClick}
                rounded='0'
                variant='ghost'
                opacity={props.hovering ? '100%' : '0%'}
                aria-label='edit'
            />

            <IconButton
                icon={
                    <Icon
                        icon='trash'
                        variant={props.iconVariant}
                        fontSize='2xl'
                    />
                }
                onClick={props.onDeleteClick}
                rounded='0'
                variant='ghost'
                opacity={props.hovering ? '100%' : '0%'}
                aria-label='delete'
            />
        </Stack>
    );
}
