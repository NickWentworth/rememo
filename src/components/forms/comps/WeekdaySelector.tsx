import Button from '@/components/Button';
import { getBitAt, toggleBitAt } from '@/lib/bitfield';
import styles from './comps.module.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type WeekdaySelectorProps = {
    // fields from controller component
    value: number;
    onChange: (days: number) => void;
};

export function WeekdaySelector(props: WeekdaySelectorProps) {
    return (
        <div className={styles.weekdaySelector}>
            {WEEKDAYS.map((day, idx) => (
                <Button
                    key={idx}
                    type={getBitAt(props.value, idx) ? 'solid' : 'outline'}
                    border='square'
                    onClick={() =>
                        props.onChange(toggleBitAt(props.value, idx))
                    }
                >
                    {day}
                </Button>
            ))}
        </div>
    );
}
