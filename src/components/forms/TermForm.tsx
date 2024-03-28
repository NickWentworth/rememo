'use client';

import { Trash } from '@/components/icons';
import Button, { AddButton } from '@/components/Button';
import { Form, FormSection, FormField, Spacer } from './structure';
import { DateTimePicker } from './comps';
import { TermPayload } from '@/lib/types';
import { TermVacation } from '@prisma/client';
import { todayUTC } from '@/lib/date';
import { trpc } from '@/lib/trpc/client';
import { useFormController } from '@/lib/hooks/useFormController';
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

export const useTermFormController = useFormController<TermPayload>;

type TermFormProps = {
    controller: ReturnType<typeof useTermFormController>;
};

export function TermForm(props: TermFormProps) {
    const { mutate: upsertTerm } = trpc.term.upsert.useMutation();

    // form data managed by useForm hook
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TermPayload>({
        values:
            props.controller.state.mode === 'update'
                ? props.controller.state.data
                : DEFAULT_TERM,
    });

    // dynamic vacations section managed by useFieldArray hook
    const vacationsField = useFieldArray({
        control,
        name: 'vacations',
    });

    function onSubmit(data: Partial<TermPayload>) {
        // common term data used when either creating or updating
        const partialTerm = {
            // required term fields
            name: data.name!,
            start: data.start!,
            end: data.end!,
            vacations: data.vacations ?? [],
        } satisfies Partial<TermPayload>;

        switch (props.controller.state.mode) {
            case 'closed':
                console.error('Term form is being submitted in closed state');
                break;

            case 'create':
                upsertTerm({
                    ...partialTerm,
                    id: '', // id will be auto-generated by prisma
                    userId: '', // user id will be added after verifying authentication
                });
                break;

            case 'update':
                const initial = props.controller.state.data;
                upsertTerm({
                    ...partialTerm,
                    id: initial.id,
                    userId: initial.userId,
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
            title='Term'
            sections={[
                // main term data
                <FormSection>
                    <FormField label='Name'>
                        <input
                            type='text'
                            {...register('name', {
                                required: 'Term must have a name',
                            })}
                        />
                    </FormField>
                    <p className={styles.error}>{errors.name?.message}</p>

                    <Spacer />

                    <div className={styles.termDates}>
                        <FormField label='Start Date'>
                            <Controller
                                control={control}
                                name='start'
                                rules={{
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
                        </FormField>

                        <FormField label='End Date'>
                            <Controller
                                control={control}
                                name='end'
                                rules={{
                                    validate: (value, form) =>
                                        value > form.start,
                                }}
                                render={({ field }) => (
                                    <DateTimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        hideTime
                                    />
                                )}
                            />
                        </FormField>
                    </div>
                    <p className={styles.error}>
                        {(errors.start || errors.end) &&
                            'End date must come after start date'}
                    </p>
                </FormSection>,

                // vacations field array
                <FormSection>
                    <p>Vacations</p>

                    <Spacer />

                    {vacationsField.fields.flatMap((field, idx) => [
                        <div key={field.id} className={styles.termVacation}>
                            <FormField label='Vacation Name'>
                                <div className={styles.termVacationNameRow}>
                                    <input
                                        type='text'
                                        {...register(`vacations.${idx}.name`, {
                                            required:
                                                'Vacation must have a name',
                                        })}
                                    />

                                    <Button
                                        type='transparent'
                                        onClick={() =>
                                            vacationsField.remove(idx)
                                        }
                                        icon={<Trash color='light' size={16} />}
                                    />
                                </div>
                            </FormField>
                            <p className={styles.error}>
                                {errors.vacations?.at?.(idx)?.name?.message}
                            </p>

                            <div className={styles.termDates}>
                                <FormField label='Start Date'>
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
                                </FormField>

                                <FormField label='End Date'>
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
                                </FormField>
                            </div>

                            <p className={styles.error}>
                                {errors.vacations?.at?.(idx)?.start?.message ||
                                    errors.vacations?.at?.(idx)?.end?.message}
                            </p>
                        </div>,

                        <Spacer key={`${field.id}spacer`} />,
                    ])}

                    <div className={styles.alignCenter}>
                        <AddButton
                            onClick={() =>
                                vacationsField.append(DEFAULT_TERM_VACATION)
                            }
                        />
                    </div>
                </FormSection>,
            ]}
        />
    );
}
