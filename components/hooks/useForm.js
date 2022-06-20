import { useEffect, useState } from 'react';

// data is the object currently being edited or null if adding
// emptyData is an empty representation of the object for adding
export function useForm(data, emptyData, submitCallback) {
    const [formData, setFormData] = useState(data);

    useEffect(() => {
        setFormData(data || emptyData);
        console.log(data);
    }, [data])

    async function handleSubmit(event) {
        event.preventDefault();
        await submitCallback();
    }

    function handleInputChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: (event.target.type == 'checkbox') ? event.target.checked : event.target.value
        })
    }

    return { formData, setFormData, handleSubmit, handleInputChange };
}