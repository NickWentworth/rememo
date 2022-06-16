import { useState, useEffect } from 'react';
import Image from 'next/image';
import { taskModifyMode } from './taskList';
import styles from './taskModifyForm.module.css';

export function TaskModifyForm({ viewInfo, closeView, collectData }) {
    const [formData, setFormData] = useState(viewInfo.focusedTask);
    const [showTime, setShowTime] = useState(viewInfo.focusedTask.dueTime);

    useEffect(() => {
        setFormData(viewInfo.focusedTask); // reset form data
        setShowTime(viewInfo.focusedTask.dueTime); // and show/hide time option based on due time
    }, [viewInfo.focusedTask]) // when initial task changes

    function handleSubmit(event) {
        event.preventDefault(); // don't want to redirect page

        let data = {...formData};
        data.dueTime = showTime ? data.dueTime : ''; // if time is not included, remove it from the form data

        collectData(data); // return form data to parent component
    }

    function onInputChanged(event) {
        let data = {...formData};
        data[event.target.name] = event.target.value;
        setFormData(data);
    }

    return (
        <div className={styles.taskModifyForm + ' boxShadowDark'} hidden={viewInfo.mode == taskModifyMode.closed}>
            <div className={styles.closeButtonWrapper + ' interactableHighlight'}>
                <Image
                    src='/images/icons/closeWhite.png'
                    width={40}
                    height={40}
                    onClick={closeView.bind(this)}
                />
            </div>
            
            <h1 hidden={viewInfo.mode != taskModifyMode.add}>Add Task</h1>
            <h1 hidden={viewInfo.mode != taskModifyMode.edit}>Edit Task</h1>

            <hr />

            <form onSubmit={handleSubmit}>
                <div><input name='name' type='text' onChange={onInputChanged} value={formData.name} placeholder='Name' required /></div>
                <div><input name='class' type='text' onChange={onInputChanged} value={formData.class} placeholder='Class' /></div>
                <div><textarea name='description' type='text' rows='4' onChange={onInputChanged} value={formData.description} placeholder='Description' /></div>

                <hr />

                <div><input className='interactable' name='dueDate' type='date' onChange={onInputChanged} value={formData.dueDate} required /></div>
                
                <div className={styles.timeCheckboxDiv}>
                    <input type='checkbox' onChange={setShowTime.bind(this, !showTime)} checked={showTime} />
                    <p>Include Time</p>
                    <input className='interactable' style={{ opacity: showTime ? '100%' : '0%' }} name='dueTime' type='time' onChange={onInputChanged} value={formData.dueTime} />
                </div>

                <hr />

                <button>Submit</button>
            </form>
        </div>
    )
}
