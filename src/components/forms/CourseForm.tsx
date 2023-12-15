'use client';

import { Close } from '../icons';
import { CoursePayload } from '@/lib/types';
import { FormState } from '@/lib/hooks/useFormState';
import { createCourse, updateCourse } from '@/lib/actions/courses';
import { useTermData } from '../providers';
import { useForm } from 'react-hook-form';
import styles from './form.module.css';

const COLORS = [
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
};

export function CourseForm(props: CourseFormProps) {
    // reference all terms to link a course to a term
    const terms = useTermData().data;

    // TODO: mark term as selected and set that one as default
    const TEST_TERM_ID = terms[0].id;

    // form data managed by useForm hook
    const { register, handleSubmit, reset, watch } = useForm<CoursePayload>({
        values:
            props.state.mode === 'update'
                ? props.state.data
                : { ...DEFAULT_COURSE, termId: TEST_TERM_ID },
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

                    <button
                        className={styles.closeButton}
                        type='button'
                        onClick={props.onCloseClick}
                    >
                        <Close size={30} color='white' />
                    </button>
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
                            {...register('name', { required: true })}
                        />
                    </div>

                    {/* term */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='term'>
                            <p>Term</p>
                        </label>

                        <select id='term' {...register('termId')}>
                            {terms.map((t) => (
                                <option value={t.id}>{t.name}</option>
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

                        {/* TODO: make this a custom radio input component */}
                        <select
                            id='color'
                            style={{ color: watch('color') }}
                            {...register('color')}
                        >
                            {COLORS.map((c) => (
                                <option value={c} style={{ color: c }}>
                                    {c}
                                </option>
                            ))}
                        </select>
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

                <button className={styles.submit} type='submit'>
                    <h3>Submit</h3>
                </button>
            </form>
        </div>
    );
}
