import Calendar from '@/components/Calendar';
import styles from './window.module.css';

type CalendarWindowProps = {
    display: 'today' | 'week';
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
                <Calendar initialTime={7} />
            </div>
        </div>
    );
}
