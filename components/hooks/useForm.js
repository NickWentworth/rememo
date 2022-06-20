import { useEffect, useState } from 'react';

// data is the object currently being edited or null if adding
// emptyData is an empty representation of the object for adding
export function useForm({ editingTerm, onSubmit, nullEditingTerm }) {
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

    return { formData, close, handleSubmit, handleInputChange };
}