import { Form } from './Form';
import { useForm } from '../hooks/useForm';

export function TermForm({ editingData, add, edit, nullEditingData }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData });

    if (!formData) {
        return null;
    }
    
    return (
        <Form title={(formData.id ? 'Edit' : 'Add') + ' Term'} onSubmit={handleSubmit} close={close}>
            <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} placeholder='Name' required />
            <input name='startDate' type='date' value={formData?.startDate || ''} onChange={handleInputChange} required />
            <input name='endDate' type='date' value={formData?.endDate || ''} onChange={handleInputChange} required />
        </Form>
    )
}
