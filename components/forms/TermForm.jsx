import { useState, useEffect } from 'react';
// import { Form } from "../hooks/Form";
import styles from './forms.module.css';

const emptyTerm = {
    name: '',
    startDate: '',
    endDate: ''
}

// editingTerm is the current term being edited, {} for the default empty term, null to close form
// onSubmit function is to be called when form is submitted, most likely an api call
// nullEditingTerm is called when closing form, parent should set editingTerm state to null
export function TermForm({ editingTerm, onSubmit, nullEditingTerm }) {
    const [formData, setFormData] = useState(editingTerm);

    useEffect(() => {
        if (editingTerm == {}) {
            setFormData(emptyTerm);
        } else {
            setFormData(editingTerm);
        }
    }, [editingTerm])

    // close form
    function close() {
        setFormData(null);
        nullEditingTerm();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        await onSubmit(formData);
        close();
    }

    function handleInputChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: (event.target.type == 'checkbox') ? event.target.checked : event.target.value
        })
    }

    if (!formData) {
        return null;
    }
    
    return (
        <div className={styles.page}>
            <div className={styles.background} />

            <form className={styles.form + ' boxShadowDark'} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h1>Term Form</h1>
                    <img
                        className={styles.close + ' interactableHighlight'}
                        src='/images/icons/closeWhite.png'
                        width={50} height={50}
                        onClick={() => close()}
                    />
                </div>

                <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} placeholder='Name' required />
                <input name='startDate' type='date' value={formData?.startDate || ''} onChange={handleInputChange} required />
                <input name='endDate' type='date' value={formData?.endDate || ''} onChange={handleInputChange} required />

                <button className={styles.submit} type='submit'>Submit</button>
            </form>
        </div>
    )
}