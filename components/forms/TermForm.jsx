import { Form } from './Form';
import { useForm } from '../../lib/hooks/useForm';

export function TermForm({ editingData, add, edit, nullEditingData }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData });

    if (!formData) {
        return null;
    }
    
    return (
        <Form title={(formData.id ? 'Edit' : 'Add') + ' Term'} onSubmit={handleSubmit} close={close}>
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
        </Form>
    )
}
