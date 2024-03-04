'use client';

import Button from '.';
import { Plus } from '../icons';

type AddButtonProps = {
    onClick: () => void;
    disabled?: boolean;
};

export default function AddButton(props: AddButtonProps) {
    return (
        <Button
            type='solid'
            onClick={props.onClick}
            icon={<Plus size={20} color='dark' />}
            border='round'
            disabled={props.disabled}
        />
    );
}
