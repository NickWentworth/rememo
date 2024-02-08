import { getBitAt, setBitAt } from '@/lib/bitfield';
import styles from './form.module.css';

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
                <div key={idx} className={styles.weekdaySelectorDay}>
                    <input
                        type='checkbox'
                        checked={getBitAt(props.value, idx)}
                        onChange={(e) =>
                            props.onChange(
                                setBitAt(props.value, idx, e.target.checked)
                            )
                        }
                    />

                    <p>{day}</p>
                </div>
            ))}
        </div>
    );
}
