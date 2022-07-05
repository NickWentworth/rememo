import { Form } from './Form';
import { Colors } from './Colors';
import { useForm } from '../../lib/hooks/useForm';

// https://coolors.co/ff4747-ff8f26-ffca3a-99d041-38a734-41d6be-00b4d8-7777ff-c55eed-ff4cd2
const classColors = ["#ff4747","#ff8f26","#ffca3a","#99d041","#38a734","#41d6be","#00b4d8","#7777ff","#c55eed","#ff4cd2"];

export function CourseForm({ editingData, add, edit, nullEditingData, focusedTermId, terms }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData, termId: focusedTermId });

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
                <h3>Term</h3>
                <select name='termId' onChange={handleInputChange} defaultValue={focusedTermId} required>
                    {/* in case no focusedTermId, this will be selected, forcing user to give a term */}
                    <option value='' hidden></option>

                    {terms.map((term) => (
                        <option key={term.id} value={term.id}>{term.name}</option>
                    ))}
                </select>
            </label>

            <hr />

            <label>
                <h3>Color</h3>
                <Colors colors={classColors} value={formData?.color || ''} onChange={handleInputChange} />
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
