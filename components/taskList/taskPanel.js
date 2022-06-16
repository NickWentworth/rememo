import { useState } from 'react';
import Image from 'next/image';
import { getFormattedDueString } from '../../lib/taskUtility';
import styles from './taskPanel.module.css';

const iconSize = 30;

export function TaskPanel({ task, focused, editTask, deleteTask, setProgress }) {
    const [showIcons, setShowIcons] = useState(false);

    let [formattedString, color] = getFormattedDueString(task);

    function handleProgressChange(event) {
        setProgress(event.target.value);
    }

    return (
        <div
            className={styles.taskPanel}
            style={{
                border: focused ? '3px solid var(--white)' : '3px solid transparent',
                opacity: (task.progress == 100) ? '50%' : '100%'
            }}
            onMouseOver={setShowIcons.bind(this, true)}
            onMouseLeave={setShowIcons.bind(this, false)}
        >
            <div className={styles.taskPanelColorTab} style={{ backgroundColor: task.color }}>
                <div className={styles.taskPanelColorTabButtonWrapper} hidden={!showIcons}>
                    <Image
                        className='interactableHighlight50'
                        src='/images/icons/editDark.png'
                        width={iconSize}
                        height={iconSize}
                        onClick={editTask.bind(this, task)}
                    />

                    <Image
                        className='interactableHighlight50'
                        src='/images/icons/deleteDark.png'
                        width={iconSize}
                        height={iconSize}
                        onClick={deleteTask.bind(this, task)}
                    />
                </div>
            </div>

            <div className={styles.taskPanelBody}>
                <div className={styles.taskPanelHeader}>
                    <h2>{task.name}</h2>
                    <h4 style={{ color: task.color }}>{task.class}</h4>
                </div>

                <p style={{ color }}>{formattedString}</p>

                <div className={styles.taskPanelProgress}>
                    {/* TODO - figure out why range slider doesn't work anymore */}
                    <input type='range' value={task.progress} min={0} max={100} step={5} onChange={handleProgressChange} disabled />
                    <p className={styles.taskPanelProgressLabel}>{task.progress}%</p>
                </div>

                <hr hidden={!task.description} />
                <p>{task.description}</p>
            </div>
        </div>
    )
}
