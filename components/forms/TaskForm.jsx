import { Form } from './Form';
import { useForm } from '../hooks/useForm';

export function TaskForm({ editingData, add, edit, nullEditingData, classes }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData });

    if (!formData) {
        return null;
    }
    
    return (
        <Form title={(formData.id ? 'Edit' : 'Add') + ' Term'} onSubmit={handleSubmit} close={close}>
            <label>
                <h3>Name</h3>
                <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} required />
            </label>

            <label>
                <h3>Course</h3>
                <input name='course' type='text' value={formData?.courseId || ''} onChange={handleInputChange} />
            </label>

            <label>
                <h3>Description</h3>
                <textarea name='description' rows={4} value={formData?.description || ''} onChange={handleInputChange} />
            </label>

            <hr />

            <label>
                <h3>Due Date</h3>
                <input name='dueDate' type='date' value={formData?.dueDate || ''} onChange={handleInputChange} required />
            </label>

            <label>
                <h3>Due Time</h3>
                <input name='dueTime' type='time' value={formData?.dueTime || ''} onChange={handleInputChange} />
            </label>
        </Form>
    )
}
