import { Plus, Trash } from '@/components/icons';
import { DateTimePicker, WeekdaySelector } from './elements';
import { useFormController } from '@/lib/hooks/useFormController';
import { CoursePayload } from '@/lib/types';
import { todayUTC } from '@/lib/date';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { trpc } from '@/lib/trpc/client';
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
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';

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
} satisfies CoursePayload['times'][number];

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
                upsertCourse({
                    ...partialCourse,
                    id: initial.id,
                });
                break;
        }

        props.controller.close();
        reset();
    }

    let title = '';
    switch (props.controller.state.mode) {
        case 'create':
            title = 'Add Course';
            break;
        case 'update':
            title = 'Modify Course';
            break;
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
                            {/* course name */}
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Name</FormLabel>

                                <Input
                                    type='text'
                                    {...register('name', {
                                        required: 'Course must have a name',
                                    })}
                                />

                                <FormErrorMessage>
                                    {errors.name?.message}
                                </FormErrorMessage>
                            </FormControl>

                            {/* course's term parent */}
                            <FormControl>
                                <FormLabel>Term</FormLabel>

                                <Select {...register('termId')}>
                                    {terms?.map((term) => (
                                        <option key={term.id} value={term.id}>
                                            {term.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <Divider />

                            <FormControl>
                                <FormLabel>Course Color</FormLabel>

                                <Controller
                                    control={control}
                                    name='color'
                                    render={({ field }) => (
                                        <RadioGroup
                                            name={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <Flex justify='space-around'>
                                                {COLORS.map((color) => (
                                                    <Radio
                                                        key={color}
                                                        value={color}
                                                        size='xl'
                                                        borderColor={color}
                                                        _checked={{
                                                            bg: color,
                                                        }}
                                                    />
                                                ))}
                                            </Flex>
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>

                            <Divider />

                            {/* instructor */}
                            <FormControl>
                                <FormLabel>Instructor (optional)</FormLabel>

                                <Input
                                    type='text'
                                    {...register('instructor')}
                                />
                            </FormControl>

                            {/* location */}
                            <FormControl>
                                <FormLabel>Location (optional)</FormLabel>

                                <Input type='text' {...register('location')} />
                            </FormControl>

                            <Divider />

                            {/* course times */}
                            <FormLabel>Course Times</FormLabel>
                            {timesField.fields.map((field, idx) => (
                                <SimpleGrid
                                    key={field.id}
                                    columns={2}
                                    bg='gray.800'
                                    p='0.5rem'
                                    rounded='md'
                                    gap='0.5rem'
                                >
                                    <FormControl
                                        isInvalid={
                                            !!errors.times?.at?.(idx)?.start
                                        }
                                    >
                                        <FormLabel>Start Time</FormLabel>
                                        <Controller
                                            control={control}
                                            name={`times.${idx}.start`}
                                            rules={{
                                                validate: (v, f) =>
                                                    v < f.times[idx].end ||
                                                    'End time must come after start time',
                                            }}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    hideDate
                                                />
                                            )}
                                        />

                                        <FormErrorMessage>
                                            {
                                                errors.times?.at?.(idx)?.start
                                                    ?.message
                                            }
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl
                                        isInvalid={
                                            !!errors.times?.at?.(idx)?.start
                                        }
                                    >
                                        <Flex>
                                            <FormLabel flex='1'>
                                                End Time
                                            </FormLabel>

                                            <IconButton
                                                onClick={() =>
                                                    timesField.remove(idx)
                                                }
                                                size='xs'
                                                _hover={{ bg: 'red.400' }}
                                                icon={
                                                    <Trash
                                                        color='white'
                                                        size={16}
                                                    />
                                                }
                                                aria-label='delete time'
                                            />
                                        </Flex>

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
                                    </FormControl>

                                    <GridItem colSpan={2}>
                                        <FormControl
                                            isInvalid={
                                                !!errors.times?.at?.(idx)?.days
                                            }
                                        >
                                            <FormLabel>Repeated Days</FormLabel>

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
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        isInvalid={
                                                            !!errors.times?.at?.(
                                                                idx
                                                            )?.days
                                                        }
                                                    />
                                                )}
                                            />

                                            <FormErrorMessage>
                                                {
                                                    errors.times?.at?.(idx)
                                                        ?.days?.message
                                                }
                                            </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>
                                </SimpleGrid>
                            ))}

                            <IconButton
                                onClick={() =>
                                    timesField.append(DEFAULT_COURSE_TIME)
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
