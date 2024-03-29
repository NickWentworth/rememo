'use client';

import { Trash } from '@/components/icons';
import Button, { AddButton } from '@/components/Button';
import { Form, FormSection, FormField, Spacer } from './structure';
import { DateTimePicker, WeekdaySelector } from './comps';
import { trpc } from '@/lib/trpc/client';
import { useFormController } from '@/lib/hooks/useFormController';
import { CoursePayload } from '@/lib/types';
import { CourseTime } from '@prisma/client';
import { todayUTC } from '@/lib/date';
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
    start: todayUTC('8:00'),
    end: todayUTC('10:00'),
    days: 0,
    courseId: '',
} satisfies CourseTime;

export const useCourseFormController = useFormController<CoursePayload>;

type CourseFormProps = {
    controller: ReturnType<typeof useCourseFormController>;

    // a selected term is required for a course to be added/updated
    selectedTermId: string;
};

export function CourseForm(props: CourseFormProps) {
    // reference all terms to link a course to a term
    const { data: terms } = trpc.term.all.useQuery();

    const { mutate: upsertCourse } = trpc.course.upsert.useMutation();

    // form data managed by useForm hook
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CoursePayload>({
        values:
            props.controller.state.mode === 'update'
                ? props.controller.state.data
                : { ...DEFAULT_COURSE, termId: props.selectedTermId },
    });

    // dynamic course times section managed by useFieldArray hook
    const timesField = useFieldArray({
        control,
        name: 'times',
    });

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

        switch (props.controller.state.mode) {
            case 'closed':
                console.error('Term form is being submitted in closed state');
                break;

            case 'create':
                upsertCourse({
                    ...partialCourse,
                    id: '',
                });
                break;

            case 'update':
                const initial = props.controller.state.data;
                console.log({
                    ...partialCourse,
                    id: initial.id,
                });
                upsertCourse({
                    ...partialCourse,
                    id: initial.id,
                });
                break;
        }

        props.controller.close();
        reset();
    }

    return (
        <Form
            controller={props.controller}
            onSubmit={handleSubmit(onSubmit)}
            title='Course'
            sections={[
                // main course data
                <FormSection>
                    <FormField label='Name'>
                        <input
                            type='text'
                            {...register('name', {
                                required: 'Course must have a name',
                            })}
                        />
                    </FormField>
                    <p className={styles.error}>{errors.name?.message}</p>

                    <Spacer />

                    <FormField label='Term'>
                        <select id='term' {...register('termId')}>
                            {terms?.map((term) => (
                                <option key={term.id} value={term.id}>
                                    {term.name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </FormSection>,

                // course color
                <FormSection>
                    <p>Course Color</p>

                    <Spacer />

                    <div className={styles.courseColorPicker}>
                        {COLORS.map((color) => (
                            <input
                                key={color}
                                className={styles.courseColor}
                                type='radio'
                                value={color}
                                style={{ color }}
                                {...register('color')}
                            />
                        ))}
                    </div>
                </FormSection>,

                // optional course data
                <FormSection>
                    <FormField label='Instructor' optional>
                        <input type='text' {...register('instructor')} />
                    </FormField>

                    <Spacer />

                    <FormField label='Location' optional>
                        <input type='text' {...register('location')} />
                    </FormField>
                </FormSection>,

                // course times
                <FormSection>
                    <p>Course Times</p>

                    <Spacer />

                    {timesField.fields.flatMap((field, idx) => [
                        <div key={field.id} className={styles.courseTime}>
                            <div className={styles.termDates}>
                                <FormField label='Start Time'>
                                    <Controller
                                        control={control}
                                        name={`times.${idx}.start`}
                                        rules={{
                                            validate: (v, f) =>
                                                v < f.times[idx].end,
                                        }}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                hideDate
                                            />
                                        )}
                                    />
                                </FormField>

                                <FormField label='End Time'>
                                    <Controller
                                        control={control}
                                        name={`times.${idx}.end`}
                                        rules={{
                                            validate: (v, f) =>
                                                v > f.times[idx].start,
                                        }}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                hideDate
                                            />
                                        )}
                                    />
                                </FormField>
                            </div>
                            <p className={styles.error}>
                                {(errors.times?.at?.(idx)?.start ||
                                    errors.times?.at?.(idx)?.end) &&
                                    'End time must come after start time'}
                            </p>

                            <p>Repeated Days</p>
                            <div className={styles.courseTimeDaysRow}>
                                <Controller
                                    control={control}
                                    name={`times.${idx}.days`}
                                    rules={{
                                        validate: (v) =>
                                            v !== 0 ||
                                            'Select the day(s) this course time repeats',
                                    }}
                                    render={({ field }) => (
                                        <WeekdaySelector
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <Button
                                    type='transparent'
                                    onClick={() => timesField.remove(idx)}
                                    icon={<Trash color='light' size={16} />}
                                />
                            </div>
                            <p className={styles.error}>
                                {errors.times?.at?.(idx)?.days?.message}
                            </p>
                        </div>,

                        <Spacer key={`${field.id}spacer`} />,
                    ])}

                    <div className={styles.alignCenter}>
                        <AddButton
                            onClick={() =>
                                timesField.append(DEFAULT_COURSE_TIME)
                            }
                        />
                    </div>
                </FormSection>,
            ]}
        />
    );
}
