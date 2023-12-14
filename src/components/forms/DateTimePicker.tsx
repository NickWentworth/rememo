import { dateISO, timeISO, updateDate, updateTime } from '@/lib/date';
import styles from './form.module.css';

type DateTimePickerProps = {
    value: Date;
    set: (date: Date) => void;
    // optionally hide either date or time element
    hideDate?: boolean;
    hideTime?: boolean;
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
                hidden={props.hideDate}
            />
            <input
                type='time'
                value={timeISO(props.value)}
                onChange={(e) =>
                    props.set(updateTime(props.value, e.target.value))
                }
                hidden={props.hideTime}
            />
        </div>
    );
}
