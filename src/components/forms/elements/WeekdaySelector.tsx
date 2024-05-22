import { getBitAt, toggleBitAt } from '@/lib/bitfield';
import { Button, ButtonGroup } from '@chakra-ui/react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type WeekdaySelectorProps = {
    // fields from controller component
    value: number;
    onChange: (days: number) => void;
    isInvalid: boolean;
};

export function WeekdaySelector(props: WeekdaySelectorProps) {
    return (
        <ButtonGroup
            isAttached
            display='grid'
            gridAutoFlow='column'
            gridAutoColumns='1fr'
            overflow='hidden'
        >
            {WEEKDAYS.map((day, idx) => {
                const isActive = getBitAt(props.value, idx);

                return (
                    <Button
                        key={day}
                        variant={isActive ? 'solid' : 'outline'}
                        colorScheme={props.isInvalid ? 'red' : 'accent'}
                        onClick={() =>
                            props.onChange(toggleBitAt(props.value, idx))
                        }
                    >
                        {day}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
}
