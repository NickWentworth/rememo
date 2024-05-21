import { Plus, Trash } from '@/components/icons';
import { DateTimePicker } from './comps';
import { TermPayload } from '@/lib/types';
import { todayUTC } from '@/lib/date';
import { trpc } from '@/lib/trpc/client';
import { useFormController } from '@/lib/hooks/useFormController';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';

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
} satisfies TermPayload['vacations'][number];

export const useTermFormController = useFormController<TermPayload>;

type TermFormProps = {
    controller: ReturnType<typeof useTermFormController>;
};

export function TermForm(props: TermFormProps) {
    const { mutate: upsertTerm } = trpc.term.upsert.useMutation();

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

    const vacationsField = useFieldArray({
        control,
        name: 'vacations',
    });

    let title = '';
    switch (props.controller.state.mode) {
        case 'create':
            title = 'Add Term';
            break;
        case 'update':
            title = 'Modify Term';
            break;
    }

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
        <Modal
            size='2xl'
            isOpen={props.controller.state.mode !== 'closed'}
            onClose={props.controller.close}
            scrollBehavior='inside'
        >
            <ModalOverlay />

            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalHeader>
                        <Text variant='h1'>{title}</Text>
                        <ModalCloseButton size='lg' />
                    </ModalHeader>

                    <Divider />

                    <ModalBody>
                        <Stack>
                            {/* main term data */}
                            <SimpleGrid columns={2} gap='0.5rem'>
                                <GridItem colSpan={2}>
                                    <FormControl isInvalid={!!errors.name}>
                                        <FormLabel>Name</FormLabel>

                                        <Input
                                            type='text'
                                            {...register('name', {
                                                required:
                                                    'Term must have a name',
                                            })}
                                        />

                                        <FormErrorMessage>
                                            {errors.name?.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </GridItem>

                                <FormControl isInvalid={!!errors.start}>
                                    <FormLabel>Start Date</FormLabel>

                                    <Controller
                                        control={control}
                                        name='start'
                                        rules={{
                                            validate: (value, form) =>
                                                value < form.end ||
                                                'End date must come after start date',
                                        }}
                                        render={({ field }) => (
                                            <DateTimePicker
                                                hideTime
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />

                                    <FormErrorMessage>
                                        {errors.start?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.start}>
                                    <FormLabel>End Date</FormLabel>

                                    <Controller
                                        control={control}
                                        name='end'
                                        render={({ field }) => (
                                            <DateTimePicker
                                                hideTime
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <Divider />

                            {/* term vacations */}
                            <FormLabel>Vacations</FormLabel>
                            {vacationsField.fields.map((field, idx) => (
                                <SimpleGrid
                                    key={field.id}
                                    columns={2}
                                    bg='gray.800'
                                    p='0.5rem'
                                    rounded='md'
                                    gap='0.5rem'
                                >
                                    <GridItem colSpan={2}>
                                        <FormControl
                                            isInvalid={
                                                !!errors.vacations?.at?.(idx)
                                                    ?.name
                                            }
                                        >
                                            <Flex>
                                                <FormLabel flex='1'>
                                                    Vacation Name
                                                </FormLabel>

                                                <IconButton
                                                    onClick={() =>
                                                        vacationsField.remove(
                                                            idx
                                                        )
                                                    }
                                                    size='xs'
                                                    _hover={{ bg: 'red.400' }}
                                                    icon={
                                                        <Trash
                                                            color='white'
                                                            size={16}
                                                        />
                                                    }
                                                    aria-label='delete vacation'
                                                />
                                            </Flex>

                                            <Input
                                                type='text'
                                                {...register(
                                                    `vacations.${idx}.name`,
                                                    {
                                                        required:
                                                            'Vacation must have a name',
                                                    }
                                                )}
                                            />

                                            <FormErrorMessage>
                                                {
                                                    errors.vacations?.at?.(idx)
                                                        ?.name?.message
                                                }
                                            </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <FormControl
                                        isInvalid={
                                            !!errors.vacations?.at?.(idx)?.start
                                        }
                                    >
                                        <FormLabel>Start Date</FormLabel>

                                        <Controller
                                            control={control}
                                            name={`vacations.${idx}.start`}
                                            rules={{
                                                validate: {
                                                    chrono: (v, f) =>
                                                        v <=
                                                            f.vacations[idx]
                                                                .end ||
                                                        'Vacation end date must be on or after start date',
                                                    between: (v, f) =>
                                                        v >= f.start ||
                                                        'Vacation must come between term start and end dates',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    hideTime
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />

                                        <FormErrorMessage>
                                            {
                                                errors.vacations?.at?.(idx)
                                                    ?.start?.message
                                            }
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl
                                        isInvalid={
                                            !!errors.vacations?.at?.(idx)?.start
                                        }
                                    >
                                        <FormLabel>End Date</FormLabel>

                                        <Controller
                                            control={control}
                                            name={`vacations.${idx}.end`}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    hideTime
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </SimpleGrid>
                            ))}

                            <IconButton
                                onClick={() =>
                                    vacationsField.append(DEFAULT_TERM_VACATION)
                                }
                                icon={<Plus color='dark' size={24} />}
                                colorScheme='accent'
                                alignSelf='center'
                                rounded='full'
                                aria-label='add vacation'
                            />
                        </Stack>
                    </ModalBody>

                    <Divider />

                    <ModalFooter>
                        <Button m='auto' colorScheme='accent' type='submit'>
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    );
}
