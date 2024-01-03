'use client';

import { Close } from '../icons';
import { DateTimePicker } from './DateTimePicker';
import { TermPayload } from '@/lib/types';
import { tonightUTC } from '@/lib/date';
import { FormState } from '@/lib/hooks/useFormState';
import { createTerm, updateTerm } from '@/lib/actions/terms';
import { Controller, useForm } from 'react-hook-form';
import styles from './form.module.css';

const TEST_USER = '0';

const DEFAULT_TERM = {
    id: '',
    name: '',
    start: tonightUTC(),
    end: tonightUTC(),
    userId: '',
} satisfies TermPayload;

type TermFormProps = {
    state: FormState<TermPayload>;
    onCloseClick?: () => void;
};

export function TermForm(props: TermFormProps) {
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
        } satisfies Partial<TermPayload>;

        switch (props.state.mode) {
            case 'closed':
                console.error('Term form is being submitted in closed state');
                break;

            case 'create':
                createTerm({
                    ...partialTerm,
                    id: '',
                    userId: TEST_USER,
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

                    <button
                        className={styles.closeButton}
                        type='button'
                        onClick={props.onCloseClick}
                    >
                        <Close size={30} color='white' />
                    </button>
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

                <button className={styles.submit} type='submit'>
                    <h3>Submit</h3>
                </button>
            </form>
        </div>
    );
}
