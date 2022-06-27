import { getTaskFormattedDate } from '../../lib/dateUtility';
import { Card } from './Card';
import styles from './cards.module.css';

export function Task({ task, onEditClick, onDeleteClick, course }) {
    const [formattedDate, formattedDateColor] = getTaskFormattedDate(task.dueDate, task.dueTime);
    
    return (
        <Card focused={null} onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
            <div className={styles.taskHeader}>
                <h2>{task.name}</h2>

                {course && <h4 style={{ color: course.color }}>{course.name}</h4>}
            </div>

            <p style={{ color: formattedDateColor }}>{formattedDate}</p>

            <div className={styles.taskProgress}>
                {/* TODO - get progress bar working */}
                <input
                    type='range'
                    value={task.progress}
                    min={0} max={100} step={5}
                    disabled
                />

                <p>{task.progress}%</p>
            </div>

            <hr hidden={!task.description} />
            <p>{task.description}</p>
        </Card>
    )
}
