import { useEffect, useState } from 'react';

// takes in same args as parent props, with possible added keys (such as id's for dependent elements)
// returns:
// formData to send to child <input> element's value prop
// close to close form, likely given to clickable element
// handleSubmit to send to parent <form>'s onSubmit prop
// handleInputChange to send to child <input> element's onChange prop
export function useForm({ editingData, add, edit, nullEditingData, ...addedKeys }) {
    const [formData, setFormData] = useState(editingData);

    useEffect(() => {
        setFormData(editingData);
    }, [editingData])

    // close form
    function close() {
        setFormData(null);
        nullEditingData && nullEditingData();
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        // if formData does not have an id yet, it is a newly created object
        if (formData.id) {
            await edit({ ...addedKeys, ...formData });
        } else {
            await add({ ...addedKeys, ...formData });
        }

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
