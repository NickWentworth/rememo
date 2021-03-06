import { useState } from 'react';
import styles from './cards.module.css';

// TODO - add course's color to progress bar
export function TaskProgressBar({ value, onProgressChange }) {
    const [current, setCurrent] = useState(value);

    return (
        <div className={styles.taskProgress}>
            <input
                type='range'
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                onMouseUp={() => onProgressChange(Number.parseInt(current))}
                min={0} max={100} step={5}
            />
            <p className={styles.taskProgressLabel}>{current}%</p>
        </div>
    )
}
