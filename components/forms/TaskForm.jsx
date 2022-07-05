import { useForm } from '../../lib/hooks/useForm';
import { Form } from './Form';

export function TaskForm({ editingData, add, edit, nullEditingData, courses }) {
    const { formData, close, handleSubmit, handleInputChange } = useForm({ editingData, add, edit, nullEditingData });
    
    // returns either the selected color for a course or white if none are selected
    const getSelectedColor = courses.find((course) => course.id == formData?.courseId)?.color || 'var(--white)';

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
                <select name='courseId' onChange={handleInputChange} defaultValue={editingData?.courseId || ''} style={{ color: getSelectedColor}}>
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
