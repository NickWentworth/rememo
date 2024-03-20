'use client';

import { Close, Trash } from '@/components/icons';
import Button, { AddButton } from '@/components/Button';
import { DateTimePicker } from './DateTimePicker';
import { TermPayload } from '@/lib/types';
import { TermVacation } from '@prisma/client';
import { daysAhead, todayUTC } from '@/lib/date';
import { FormState } from '@/lib/hooks/useFormState';
import { useTermMutations } from '@/lib/query/terms';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import styles from './form.module.css';

const DEFAULT_TERM = {
    id: '',
    name: '',
    start: todayUTC(),
    end: todayUTC(),
    vacations: [],
    userId: '',
} satisfies TermPayload;

const DEFAULT_TERM_VACATION = {
    id: '',
    name: '',
    start: todayUTC(),
    end: todayUTC(),
    termId: '',
} satisfies TermVacation;

type TermFormProps = {
    state: FormState<TermPayload>;
    onCloseClick?: () => void;
};

export function TermForm(props: TermFormProps) {
    const { create: createTerm, update: updateTerm } = useTermMutations();

    // form data managed by useForm hook
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TermPayload>({
        values: props.state.mode === 'update' ? props.state.data : DEFAULT_TERM,
    });

    // dynamic vacations section managed by useFieldArray hook
    const vacationsField = useFieldArray({
        control,
        name: 'vacations',
    });

    if (props.state.mode === 'closed') {
        // return early if closed and render nothing
        return;
    }

    const title = props.state.mode === 'create' ? 'Add Term' : 'Modify Term';

    function onSubmit(data: Partial<TermPayload>) {
        // common term data used when either creating or updating
        const partialTerm = {
            // required term fields
            name: data.name!,
            start: data.start!,
            end: data.end!,
            vacations: data.vacations ?? [],
        } satisfies Partial<TermPayload>;

        switch (props.state.mode) {
            case 'closed':
                console.error('Term form is being submitted in closed state');
                break;

            case 'create':
                createTerm({
                    ...partialTerm,
                    id: '', // id will be auto-generated by prisma
                    userId: '', // user id will be added after verifying authorization
                });
                break;

            case 'update':
                const initial = props.state.data;
                updateTerm({
                    ...partialTerm,
                    id: initial.id,
                    userId: initial.userId,
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

                {/* main term data */}
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
                                required: 'Term must include a name',
                            })}
                        />

                        <p className={styles.error}>{errors.name?.message}</p>
                    </div>

                    {/* start date */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='start'>
                            <p>Start Date</p>
                        </label>

                        <Controller
                            control={control}
                            name='start'
                            rules={{
                                // ensure start date comes before end
                                validate: (value, form) => value < form.end,
                            }}
                            render={({ field }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    hideTime
                                />
                            )}
                        />
                    </div>

                    {/* end date */}
                    <div className={styles.fieldContainer}>
                        <label htmlFor='end'>
                            <p>End Date</p>
                        </label>

                        <Controller
                            control={control}
                            name='end'
                            rules={{
                                // ensure end date comes after start
                                validate: (value, form) => value > form.start,
                            }}
                            render={({ field }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    hideTime
                                />
                            )}
                        />

                        {/* start and end date errors are related, so check for either */}
                        <p className={styles.error}>
                            {(errors.start || errors.end) &&
                                'End date must come after start date'}
                        </p>
                    </div>
                </div>

                <hr />

                {/* TODO: forms get waaaaaay complicated when working with field arrays */}
                {/* TODO: break this and other field arrays into components  */}
                {/* vacations */}
                <div className={styles.formSection}>
                    <div className={styles.fieldContainer}>
                        <label>
                            <p>Vacations</p>
                        </label>

                        {/* TODO: adjust styling of term vacation field */}
                        {vacationsField.fields.map((field, idx) => (
                            <div
                                key={field.id}
                                className={styles.termVacationRow}
                            >
                                <div className={styles.termVacationRowName}>
                                    <div
                                        className={
                                            styles.termVacationRowNameLabel
                                        }
                                    >
                                        <label>
                                            <p>Name</p>
                                        </label>

                                        <Button
                                            type='transparent'
                                            onClick={() =>
                                                vacationsField.remove(idx)
                                            }
                                            icon={
                                                <Trash
                                                    color='light'
                                                    size={16}
                                                />
                                            }
                                        />
                                    </div>

                                    <input
                                        type='text'
                                        {...register(`vacations.${idx}.name`, {
                                            required:
                                                'Vacation must include a name',
                                        })}
                                    />

                                    <p className={styles.error}>
                                        {
                                            errors.vacations?.at?.(idx)?.name
                                                ?.message
                                        }
                                    </p>
                                </div>

                                <div className={styles.termVacationRowDates}>
                                    <label>
                                        <p>Start Date</p>
                                    </label>

                                    <label>
                                        <p>End Date</p>
                                    </label>

                                    <Controller
                                        control={control}
                                        name={`vacations.${idx}.start`}
                                        rules={{
                                            validate: {
                                                chrono: (v, f) =>
                                                    v <= f.vacations[idx].end ||
                                                    'Vacation end date must be on or after start date',
                                                between: (v, f) =>
                                                    v >= f.start ||
                                                    'Vacation must come between term start and end dates',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                hideTime
                                            />
                                        )}
                                    />

                                    <Controller
                                        control={control}
                                        name={`vacations.${idx}.end`}
                                        rules={{
                                            validate: {
                                                chrono: (v, f) =>
                                                    v >=
                                                        f.vacations[idx]
                                                            .start ||
                                                    'Vacation end date must be on or after start date',
                                                between: (v, f) =>
                                                    v <= f.end ||
                                                    'Vacation must lie between term start and end dates',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                hideTime
                                            />
                                        )}
                                    />
                                </div>

                                <p className={styles.error}>
                                    {errors.vacations?.at?.(idx)?.start
                                        ?.message ||
                                        errors.vacations?.at?.(idx)?.end
                                            ?.message}
                                </p>
                            </div>
                        ))}

                        <div className={styles.alignCenter}>
                            <AddButton
                                onClick={() =>
                                    vacationsField.append(DEFAULT_TERM_VACATION)
                                }
                            />
                        </div>
                    </div>
                </div>

                <hr />

                <div className={styles.alignCenter}>
                    <Button type='solid' submit>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
}
