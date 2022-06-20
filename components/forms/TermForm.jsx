import { Form } from './Form';
import { useForm } from '../hooks/useForm';
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
    const { formData, close, handleSubmit, handleInputChange } = useForm({
        editingTerm,
        onSubmit,
        nullEditingTerm
    })

    if (!formData) {
        return null;
    }
    
    return (
        <Form title='Term Form' onSubmit={handleSubmit} close={close}>
            <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} placeholder='Name' required />
            <input name='startDate' type='date' value={formData?.startDate || ''} onChange={handleInputChange} required />
            <input name='endDate' type='date' value={formData?.endDate || ''} onChange={handleInputChange} required />
        </Form>
    )
}