import { useForm } from '../../lib/hooks/useForm';
import { Background } from '../Background';
import styles from './forms.module.css';

export function TermForm({ editingData, add, edit, nullEditingData }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData });

    if (!formData) {
        return null;
    }
    
    return (
        <Background>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h1>{(formData.id ? 'Edit' : 'Add') + ' Term'}</h1>
                    <img
                        className={styles.close + ' interactableHighlight'}
                        src='/images/icons/closeWhite.png'
                        width={50} height={50}
                        onClick={() => close()}
                    />
                </div>

                <hr />

                <div className={styles.content}>
                    <label>
                        <h3>Name</h3>
                        <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} placeholder='Name' required />
                    </label>

                    <hr />

                    <label>
                        <h3>Start Date</h3>
                        <input name='startDate' type='date' value={formData?.startDate || ''} onChange={handleInputChange} required />
                    </label>

                    <label>
                        <h3>End Date</h3>
                        <input name='endDate' type='date' value={formData?.endDate || ''} onChange={handleInputChange} required />
                    </label>
                </div>

                <hr />

                <button className={styles.submit} type='submit'>Submit</button>
            </form>
        </Background>
    )
}
