import { useForm } from '../../lib/hooks/useForm';
import { signOut } from 'next-auth/react';
import styles from './forms.module.css';

export function UserForm({ editingData, edit, del }) {
    const { formData, handleSubmit, handleInputChange } = useForm({ editingData, edit });

    function handleDelete() {
        if (!window.confirm('Are you sure you want to permanently delete your Rememo account?')) {
            return;
        }

        del();
        signOut();
    }

    if (!formData) {
        return null;
    }
    
    return (
        <div className={styles.userFormBackground}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h1>{'Edit User'}</h1>
                </div>

                <hr />

                <div className={styles.content}>
                    <label>
                        <h3>Name</h3>
                        <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} required />
                    </label>
                </div>
                
                <hr />

                <button type='submit'>Submit</button>

                <hr />

                <button type='button' className={styles.deleteUser} onClick={handleDelete}>Delete User</button>
            </form>
        </div>
        
    )
}
