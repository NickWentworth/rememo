import { useEffect, useState } from 'react';
import { useForm } from '../hooks/useForm';
import { Form } from './Form';

export function TaskForm({ editingData, add, edit, nullEditingData, courses }) {
    const [selectedCourseId, setSelectedCourseId] = useState(''); // for select element
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData, courseId: selectedCourseId });

    // default to editing task's course id when it is changed
    useEffect(() => {
        setSelectedCourseId(editingData?.courseId || '');
    }, [editingData])

    // returns either the color of the selectedCourse
    const getSelectedColor = courses.find((course) => course.id == selectedCourseId)?.color || 'var(--white)';

    if (!formData) {
        return null;
    }
    
    return (
        <Form title={(formData.id ? 'Edit' : 'Add') + ' Task'} onSubmit={handleSubmit} close={close}>
            <label>
                <h3>Name</h3>
                <input name='name' type='text' value={formData?.name || ''} onChange={handleInputChange} required />
            </label>

            <label>
                <h3>Course</h3>
                <select onChange={(e) => setSelectedCourseId(e.target.value)} defaultValue={formData?.courseId} style={{ color: getSelectedColor }}>
                    <option value='' style={{ color: 'var(--white)' }}>None</option>

                    {courses.map((course) => (
                        <option key={course.id} value={course.id} style={{ color: course.color }}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                <h3>Description</h3>
                <textarea name='description' rows={4} value={formData?.description || ''} onChange={handleInputChange} />
            </label>

            <hr />

            <label>
                <h3>Due Date</h3>
                <input name='dueDate' type='date' value={formData?.dueDate || ''} onChange={handleInputChange} required />
            </label>

            <label>
                <h3>Due Time</h3>
                <input name='dueTime' type='time' value={formData?.dueTime || ''} onChange={handleInputChange} />
            </label>
        </Form>
    )
}
