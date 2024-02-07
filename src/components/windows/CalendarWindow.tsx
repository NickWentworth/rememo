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
                <Calendar
                    events={[
                        {
                            start: new Date('1970-01-01T10:00:00Z'),
                            end: new Date('1970-01-01T12:00:00Z'),
                            name: 'Science Lecture',
                            days: [2, 4],
                        },
                        {
                            start: new Date('1970-01-01T12:00:00Z'),
                            end: new Date('1970-01-01T15:00:00Z'),
                            name: 'Science Lab',
                            days: [4],
                        },
                        {
                            start: new Date('1970-01-01T14:00:00Z'),
                            end: new Date('1970-01-01T15:30:00Z'),
                            name: 'Math Lecture',
                            days: [1, 3, 5],
                        },
                    ]}
                    start={8}
                    end={17}
                />
            </div>
        </div>
    );
}
