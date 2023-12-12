import { dateISO, timeISO, updateDate, updateTime } from '@/lib/date';
import styles from './form.module.css';

type DateTimePickerProps = {
    value: Date;
    set: (date: Date) => void;
};

export function DateTimePicker(props: DateTimePickerProps) {
    return (
        <div className={styles.dateTimePicker}>
            <input
                type='date'
                value={dateISO(props.value)}
                onChange={(e) =>
                    props.set(updateDate(props.value, e.target.value))
                }
            />
            <input
                type='time'
                value={timeISO(props.value)}
                onChange={(e) =>
                    props.set(updateTime(props.value, e.target.value))
                }
            />
        </div>
    );
}
