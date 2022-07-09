import { Card, iconSize } from './Card';
import styles from './cards.module.css';

export function Course({ course, onEditClick, onDeleteClick }) {
    return (
        <Card focused={null} onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
            <h2 style={{ color: course.color }}>{course.name}</h2>

            {course.instructor && 
                <div className={styles.courseInfoLine}>
                    <img alt='Instructor' src='/images/icons/personWhite.png' width={iconSize} height={iconSize} />
                    <p>{course.instructor}</p>
                </div>
            }

            {course.location &&
                <div className={styles.courseInfoLine}>
                    <img alt='Location' src='/images/icons/locationWhite.png' width={iconSize} height={iconSize} />
                    <p>{course.location}</p>
                </div>
            }
        </Card>
    )
}
