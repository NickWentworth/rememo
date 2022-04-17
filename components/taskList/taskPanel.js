import { useState } from 'react';
import Image from 'next/image';
import { getFormattedDueString } from '../../lib/taskUtility';
import styles from './taskPanel.module.css';

const iconSize = 30;

export function TaskPanel({ task, index, focused, editTask, deleteTask }) {
    const [showIcons, setShowIcons] = useState(false);

    let [formattedString, color] = getFormattedDueString(task);

    return (
        <div
            className={styles.taskPanel}
            style={{ border: focused ? '3px solid var(--white)' : '3px solid transparent' }}
            onMouseEnter={setShowIcons.bind(this, true)}
            onMouseLeave={setShowIcons.bind(this, false)}
        >
            <div className={styles.taskPanelColorTab} style={{ backgroundColor: task.color }}>
                <div className={styles.taskPanelColorTabButtonWrapper} hidden={!showIcons}>
                    <Image
                        className='interactableHighlight50'
                        src='/images/icons/edit.svg'
                        width={iconSize}
                        height={iconSize}
                        onClick={editTask.bind(this, task, index)}
                    />

                    <Image
                        className='interactableHighlight50'
                        src='/images/icons/delete.svg'
                        width={iconSize}
                        height={iconSize}
                        onClick={deleteTask.bind(this, index)}
                    />
                </div>
            </div>

            <div className={styles.taskPanelBody}>
                <div className={styles.taskPanelHeader}>
                    <h2>{task.name}</h2>
                    <h4 style={{ color: task.color }}>{task.class}</h4>
                </div>

                <p style={{ color }}>{formattedString}</p>

                <hr hidden={!task.description} />
                
                <p>{task.description}</p>
            </div>
        </div>
    )
}
