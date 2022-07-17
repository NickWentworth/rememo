import { getTaskFormattedDate } from '../../lib/utility/date';
import { Card } from './Card';
import { TaskProgressBar } from './TaskProgressBar';
import styles from './cards.module.css';

export function Task({ task, onEditClick, onDeleteClick, course, onProgressChange }) {
    const [formattedDate, formattedDateColor] = getTaskFormattedDate(task.dueDate, task.dueTime);
    
    return (
        <Card focused={null} onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
            <div className={styles.taskHeader}>
                <h2>{task.name}</h2>

                {course && <h4 style={{ color: course.color }}>{course.name}</h4>}
            </div>

            <p style={{ color: formattedDateColor }}>{formattedDate}</p>

            <TaskProgressBar value={task.progress} onProgressChange={onProgressChange} />

            <hr hidden={!task.description} />
            <p>{task.description}</p>
        </Card>
    )
}
