import { useEffect, useState } from 'react';

// takes in same args as parent props
// returns:
// formData to send to child input element's value prop
// close to send to <Form> prop
// handleSubmit to send to <Form> prop
// handleInputChange to send to child input element's onChange prop
export function useForm({ editingData, onSubmit, nullEditingData }) {
    const [formData, setFormData] = useState(editingData);

    useEffect(() => {
        setFormData(editingData);
    }, [editingData])

    // close form
    function close() {
        setFormData(null);
        nullEditingData();
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
