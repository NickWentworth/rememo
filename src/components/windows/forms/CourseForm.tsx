'use client';

import { Close, Plus, Trash } from '@/components/icons';
import Button from '@/components/Button';
import { DateTimePicker } from './DateTimePicker';
import { WeekdaySelector } from './WeekdaySelector';
import { CoursePayload } from '@/lib/types';
import { CourseTime } from '@prisma/client';
import { tonightUTC } from '@/lib/date';
import { FormState } from '@/lib/hooks/useFormState';
import { createCourse, updateCourse } from '@/lib/actions/courses';
import { useTerms } from '@/providers';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
    times: [],
} satisfies CoursePayload;

const DEFAULT_COURSE_TIME = {
    id: '',
    start: tonightUTC('08:00'),
    end: tonightUTC('10:00'),
    days: 0,
    courseId: '',
} satisfies CourseTime;

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
        control,
        reset,
        formState: { errors },
    } = useForm<CoursePayload>({
        values:
            props.state.mode === 'update'
                ? props.state.data
                : { ...DEFAULT_COURSE, termId: props.selectedTermId },
    });

    // dynamic course times section managed by useFieldArray hook
    const timesField = useFieldArray({
        control,
        name: 'times',
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
            times: data.times ?? [],
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

                {/* times */}
                <div className={styles.formSection}>
                    <div className={styles.fieldContainer}>
                        <label>
                            <p>Course Times</p>
                        </label>

                        {timesField.fields.map((field, idx) => (
                            <div
                                key={field.id}
                                className={styles.courseTimeRow}
                            >
                                <div className={styles.courseTimeRowTimes}>
                                    <label>
                                        <p>Start Time</p>
                                    </label>

                                    <label>
                                        <p>End Time</p>
                                    </label>

                                    <Controller
                                        control={control}
                                        name={`times.${idx}.start`}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                hideDate
                                            />
                                        )}
                                    />

                                    <Controller
                                        control={control}
                                        name={`times.${idx}.end`}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                hideDate
                                            />
                                        )}
                                    />
                                </div>

                                <div className={styles.courseTimeRowDays}>
                                    <div
                                        className={
                                            styles.courseTimeRowDaySelector
                                        }
                                    >
                                        <label>
                                            <p>Repeated Days</p>
                                        </label>

                                        <Controller
                                            control={control}
                                            name={`times.${idx}.days`}
                                            render={({ field }) => (
                                                <WeekdaySelector
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type='transparent'
                                        onClick={() => timesField.remove(idx)}
                                        icon={<Trash color='light' size={16} />}
                                    />
                                </div>
                            </div>
                        ))}

                        <Button
                            type='solid'
                            onClick={() =>
                                timesField.append(DEFAULT_COURSE_TIME)
                            }
                            icon={<Plus size={20} color='dark' />}
                            border='round'
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
