import { Form } from './Form';
import { useForm } from '../hooks/useForm';

export function CourseForm({ editingData, add, edit, nullEditingData, termId }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData, termId });

    if (!formData) {
        return null;
    }
    
    return (
        <Form title={(formData.id ? 'Edit' : 'Add') + ' Course'} onSubmit={handleSubmit} close={close}>
            <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} placeholder='Name' required />
            <input name='color' type='text' value={formData?.color || ''} onChange={handleInputChange} placeholder='Color' required />
            <input name='instructor' type='text' value={formData?.instructor || ''} onChange={handleInputChange} placeholder='Instructor' />
            <input name='location' type='text' value={formData?.location || ''} onChange={handleInputChange} placeholder='Location' />
        </Form>
    )
}
