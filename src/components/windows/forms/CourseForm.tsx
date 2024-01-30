'use client';

import { Close } from '@/components/icons';
import Button from '@/components/Button';
import { CoursePayload } from '@/lib/types';
import { FormState } from '@/lib/hooks/useFormState';
import { createCourse, updateCourse } from '@/lib/actions/courses';
import { useTerms } from '@/providers';
import { useForm } from 'react-hook-form';
import styles from './form.module.css';

const COLORS = [
    '#EFFFFF', // global white color
    '#EF7E7E',
    '#ECA978',
    '#E9EB98',
    '#9EE094',
    '#95DFEF',
    '#A8BBFF',
    '#CF92FF',
    '#FFB8EF',
];

const DEFAULT_COURSE = {
    id: '',
    name: '',
    color: COLORS[0],
    instructor: null,
    location: null,
    termId: '',
} satisfies CoursePayload;

type CourseFormProps = {
    state: FormState<CoursePayload>;
    onCloseClick?: () => void;
    // a selected term is required for a course to be added/updated
    selectedTermId: string;
};

export function CourseForm(props: CourseFormProps) {
    // reference all terms to link a course to a term
    const terms = useTerms().data;

    // form data managed by useForm hook
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CoursePayload>({
        values:
            props.state.mode === 'update'
                ? props.state.data
                : { ...DEFAULT_COURSE, termId: props.selectedTermId },
    });

    if (props.state.mode === 'closed') {
        // return early if closed and render nothing
        return;
    }

    const title =
        props.state.mode === 'create' ? 'Add Course' : 'Modify Course';

    function onSubmit(data: Partial<CoursePayload>) {
        // common course data used when either creating or updating
        const partialCourse = {
            // required course fields
            name: data.name!,
            color: data.color!,
            termId: data.termId!,
            // optional course fields
            instructor:
                (data.instructor === '' ? null : data.instructor) ?? null,
            location: (data.location === '' ? null : data.location) ?? null,
        } satisfies Partial<CoursePayload>;

        switch (props.state.mode) {
            case 'closed':
                console.error('Term form is being submitted in closed state');
                break;

            case 'create':
                createCourse({
                    ...partialCourse,
                    id: '',
                });
                break;

            case 'update':
                const initial = props.state.data;
                updateCourse({
                    ...partialCourse,
                    id: initial.id,
                });
                break;
        }

        props.onCloseClick?.();
        reset();
    }

    return (
        <div className={styles.fillPage}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                {/* header section */}
                <div className={styles.formHeader}>
                    <h1>{title}</h1>

                    <Button
                        type='transparent'
                        onClick={props.onCloseClick}
                        icon={<Close size={30} color='white' />}
                    />
                </div>

                <hr />

                {/* main course data */}
                <div className={styles.formSection}>
                    {/* name */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='name'>
                            <p>Name</p>
                        </label>

                        <input
                            type='text'
                            id='name'
                            {...register('name', {
                                required: 'Course must include a name',
                            })}
                        />

                        <p className={styles.error}>{errors.name?.message}</p>
                    </div>

                    {/* term */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='term'>
                            <p>Term</p>
                        </label>

                        <select id='term' {...register('termId')}>
                            {terms.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <hr />

                {/* course color */}
                <div className={styles.formSection}>
                    <div className={styles.fieldContainer}>
                        <label htmlFor='color'>
                            <p>Course Color</p>
                        </label>

                        <div className={styles.colorSection}>
                            {COLORS.map((c) => (
                                <input
                                    key={c}
                                    {...register('color')}
                                    type='radio'
                                    value={c}
                                    style={{ color: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <hr />

                {/* optional course data */}
                <div className={styles.formSection}>
                    {/* instructor */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='instructor'>
                            <p>Instructor (optional)</p>
                        </label>

                        <input
                            type='text'
                            id='instructor'
                            {...register('instructor')}
                        />
                    </div>

                    {/* location */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='location'>
                            <p>Location (optional)</p>
                        </label>

                        <input
                            type='text'
                            id='location'
                            {...register('location')}
                        />
                    </div>
                </div>

                <hr />

                <Button type='solid' submit>
                    Submit
                </Button>
            </form>
        </div>
    );
}
