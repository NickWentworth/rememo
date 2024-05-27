'use client';

import Button from '.';
import { Icon } from '@/components/Icon';

type AddButtonProps = {
    onClick: () => void;
    disabled?: boolean;
};

export default function AddButton(props: AddButtonProps) {
    return (
        <Button
            type='solid'
            onClick={props.onClick}
            icon={<Icon icon='plus' />}
            border='round'
            disabled={props.disabled}
        />
    );
}
