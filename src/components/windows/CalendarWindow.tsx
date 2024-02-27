import Calendar from '@/components/Calendar';
import { CalendarDisplayMode } from '../Calendar/Calendar';
import styles from './window.module.css';

type CalendarWindowProps = {
    display: CalendarDisplayMode;
};

export function CalendarWindow(props: CalendarWindowProps) {
    return (
        <div className={`${styles.window} ${styles.calendar}`}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h1>Calendar</h1>
                </div>
            </div>

            <div className={styles.list}>
                <Calendar display={props.display} initialTime={7} />
            </div>
        </div>
    );
}
