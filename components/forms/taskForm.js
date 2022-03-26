import { useState, useEffect } from 'react';
import styles from './taskForm.module.css'

export default function TaskForm({ currentViewInfo, editTask, addTask }) {
    const [formData, setFormData] = useState(currentViewInfo.initialTask);
    const [showTime, setShowTime] = useState(false);
    useEffect(() => {
        setFormData(currentViewInfo.initialTask); // reset form data when new task is selected
    }, [currentViewInfo.initialTask])

    // TODO - submit should close task form window and reset editing index
    function handleSubmit(event) {
        event.preventDefault(); // don't want to redirect page
        currentViewInfo.addingTask ? addTask(formData) : editTask(currentViewInfo.editTaskIndex, formData);        
    }

    function onInputChanged(event) {
        let data = {...formData};
        data[event.target.name] = event.target.value;
        setFormData(data);
    }

    return (
        <form className={styles.editTaskForm} onSubmit={handleSubmit}>
            <div>
                <label>
                    Name
                    <input name='name' type='text' onChange={onInputChanged} value={formData.name} required />
                </label>
            </div>

            <div>
                <label>
                    Class
                    <input name='class' type='text' onChange={onInputChanged} value={formData.class} />
                </label>
            </div>

            <div>
                <label>
                    Description
                    <textarea name='description' type='text' rows='4' onChange={onInputChanged} value={formData.description} />
                </label>
            </div>

            <hr />

            <div>
                <div>
                    <label>
                        Due
                        <input name='dueDate' type='date' onChange={onInputChanged} value={formData.dueDate} required />
                    </label>
                </div>

                <div>
                    <label>
                        <input className='checkbox' name='dueTimeCheckBox' type='checkbox' onChange={setShowTime.bind(this, !showTime)} />
                        Include Time
                    </label>
                    
                    <input hidden={!showTime} name='dueTime' type='time' onChange={onInputChanged} value={formData.dueTime} />
                </div>
            </div>

            <hr />
            
            <button className={styles.submitButton} type='submit'>
                {currentViewInfo.addingTask ? 'Add Task' : 'Confirm Changes'}
            </button>
        </form>
    )
}
