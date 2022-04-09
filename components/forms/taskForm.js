import { useState, useEffect } from 'react';
import styles from './taskForm.module.css'

export default function TaskForm({ fetch, initialTask }) {
    const [formData, setFormData] = useState(initialTask);
    const [showTime, setShowTime] = useState(initialTask.dueTime);

    useEffect(() => {
        setFormData(initialTask); // reset form data when new initial task is changed
        setShowTime(initialTask.dueTime); // and show/hide time option based on due time
    }, [initialTask])

    function handleSubmit(event) {
        event.preventDefault(); // don't want to redirect page

        let data = {...formData};
        data.dueTime = showTime ? data.dueTime : ''; // if time is not included, remove it from the form data

        fetch(data); // return form data to parent component
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
                        <input className='checkbox' name='dueTimeCheckBox' type='checkbox' onChange={setShowTime.bind(this, !showTime)} checked={showTime} />
                        Include Time
                    </label>
                    
                    <input hidden={!showTime} name='dueTime' type='time' onChange={onInputChanged} value={formData.dueTime} />
                </div>
            </div>

            <hr />
            
            <button className={styles.submitButton} type='submit'>Submit</button>
        </form>
    )
}
