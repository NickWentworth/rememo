import { Form } from './Form';
import { useForm } from '../../lib/hooks/useForm';

export function CourseForm({ editingData, add, edit, nullEditingData, termId }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData, termId });

    if (!formData) {
        return null;
    }
    
    return (
        <Form title={(formData.id ? 'Edit' : 'Add') + ' Course'} onSubmit={handleSubmit} close={close}>
            <label>
                <h3>Name</h3>
                <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} placeholder='Name' required />
            </label>

            <label>
                <h3>Color</h3>
                <input name='color' type='text' value={formData?.color || ''} onChange={handleInputChange} placeholder='Color' required />
            </label>
            
            <hr />

            <label>
                <h3>Instructor</h3>
                <input name='instructor' type='text' value={formData?.instructor || ''} onChange={handleInputChange} placeholder='Instructor' />
            </label>
            <label>

                <h3>Location</h3>
                <input name='location' type='text' value={formData?.location || ''} onChange={handleInputChange} placeholder='Location' />
            </label>
        </Form>
    )
}
