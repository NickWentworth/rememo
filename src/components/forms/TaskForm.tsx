'use client';

import { Close } from '../icons';
import { Task } from '@prisma/client';
import { useReducer } from 'react';
import styles from './form.module.css';

type TaskFormProps = CreateFormMode | UpdateFormMode;

type CreateFormMode = {
    mode: 'create';
};

type UpdateFormMode = {
    mode: 'update';
    data: Task;
};

export default function TaskForm(props: TaskFormProps) {
    const [includeTime, toggleIncludeTime] = useReducer((curr) => !curr, true);

    let title;
    switch (props.mode) {
        case 'create':
            title = 'Add Task';
            break;
        case 'update':
            title = 'Modify Task';
            break;
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log('Submitted form!');
    }

    return (
        <div className={styles.fillPage}>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.formHeader}>
                    <h1>{title}</h1>

                    <button className={styles.closeButton} type='button'>
                        <Close size={30} color='white' />
                    </button>
                </div>

                <hr />

                <div className={styles.formSection}>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='name'>
                            <p>Name</p>
                        </label>
                        <input type='text' name='name' required />
                    </div>

                    <div className={styles.fieldContainer}>
                        <label htmlFor='course'>
                            <p>Course</p>
                        </label>
                        <select name='course'>
                            <option>None</option>
                            <option>Math</option>
                            <option>Science</option>
                        </select>
                    </div>

                    <div className={styles.fieldContainer}>
                        <label htmlFor='due'>
                            <p>Due</p>
                        </label>
                        <input type='date' />

                        <div className={styles.timeContainer}>
                            {/* TODO: fix layout shift when showing or hiding time */}
                            <label htmlFor='due'>
                                <p>Include Time: </p>
                            </label>

                            <input
                                type='checkbox'
                                checked={includeTime}
                                onChange={toggleIncludeTime}
                            />

                            <input
                                type='time'
                                defaultValue={'23:59'}
                                hidden={!includeTime}
                            />
                        </div>
                    </div>
                </div>

                <hr />

                {/* TODO: subtasks */}
                <div className={styles.formSection}>
                    <p>=== Subtasks here ===</p>
                </div>

                <hr />

                <div className={styles.formSection}>
                    <div className={styles.fieldContainer}>
                        <label>
                            <p>Description (optional)</p>
                        </label>
                        <textarea name='description' rows={4} />
                    </div>
                </div>

                <hr />

                <button className={styles.submit} type='submit'>
                    <h3>Submit</h3>
                </button>
            </form>
        </div>
    );
}
