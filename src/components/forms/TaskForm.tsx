import { Plus, Trash } from '@/components/icons';
import { DateTimePicker } from './elements';
import { TaskPayload } from '@/lib/types';
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
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react';

const DEFAULT_TASK = {
    id: '',
    name: '',
    completed: false,
    due: todayUTC('23:59'),
    description: '',
    subtasks: [],
    courseId: null,
    course: null,
    userId: '',
} satisfies TaskPayload;

const DEFAULT_SUBTASK = {
    id: '',
    name: '',
    completed: false,
    due: todayUTC('23:59'),
    taskId: '',
} satisfies TaskPayload['subtasks'][number];

export const useTaskFormController = useFormController<TaskPayload>;

type TaskFormProps = {
    controller: ReturnType<typeof useTaskFormController>;
};

export function TaskForm(props: TaskFormProps) {
    const { data: courses } = trpc.course.allBasic.useQuery();
    const { mutate: upsertTask } = trpc.task.upsert.useMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<TaskPayload>({
        values:
            props.controller.state.mode === 'update'
                ? props.controller.state.data
                : DEFAULT_TASK,
    });

    const subtasksField = useFieldArray({
        control,
        name: 'subtasks',
    });

    // get selected course color for displaying in course select
    const selectedCourseId = watch('courseId');
    const selectedCourseColor = courses?.find(
        (course) => course.id === selectedCourseId
    )?.color;

    function onSubmit(data: Partial<TaskPayload>) {
        // common task data used when either creating or updating
        const partialTask = {
            // required task fields
            name: data.name!,
            due: data.due!,
            // optional task fields
            description: data.description ?? '',
            subtasks: data.subtasks ?? [],
            courseId: (data.courseId === '' ? null : data.courseId) ?? null,
            course: null,
        } satisfies Partial<TaskPayload>;

        switch (props.controller.state.mode) {
            case 'closed':
                console.error('Task form is being submitted in closed state');
                break;

            case 'create':
                upsertTask({
                    ...partialTask,
                    id: '', // id will be auto-generated by prisma
                    userId: '', // user id will be added after verifying authentication
                    completed: false,
                });
                break;

            case 'update':
                const initial = props.controller.state.data;
                upsertTask({
                    ...partialTask,
                    id: initial.id,
                    completed: initial.completed,
                    userId: initial.userId,
                });
                break;
        }

        // close the form after submitting and reset fields
        props.controller.close();
        reset();
    }

    let title = '';
    switch (props.controller.state.mode) {
        case 'create':
            title = 'Add Task';
            break;
        case 'update':
            title = 'Modify Task';
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
                            {/* task name */}
                            <FormControl isInvalid={!!errors.name}>
                                <FormLabel>Name</FormLabel>

                                <Input
                                    type='text'
                                    {...register('name', {
                                        required: 'Task must have a name',
                                    })}
                                />

                                <FormErrorMessage>
                                    {errors.name?.message}
                                </FormErrorMessage>
                            </FormControl>

                            {/* linked course */}
                            <FormControl>
                                <FormLabel>Course</FormLabel>

                                <Select
                                    {...register('courseId')}
                                    color={selectedCourseColor}
                                    sx={{ color: selectedCourseColor }}
                                >
                                    <option
                                        value=''
                                        style={{
                                            color: 'var(--chakra-colors-bg-50)',
                                        }}
                                    >
                                        None
                                    </option>

                                    {courses?.map((course) => (
                                        <option
                                            key={course.id}
                                            value={course.id}
                                            style={{ color: course.color }}
                                        >
                                            {course.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* due date and time */}
                            <FormControl>
                                <FormLabel>Due</FormLabel>

                                <Controller
                                    control={control}
                                    name='due'
                                    render={({ field }) => (
                                        <DateTimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </FormControl>

                            <Divider />

                            {/* subtasks */}
                            <FormLabel mb='0'>Subtasks</FormLabel>
                            {subtasksField.fields.map((field, idx) => (
                                <Flex
                                    key={field.id}
                                    bg='bg.750'
                                    p='0.5rem'
                                    rounded='md'
                                    gap='0.5rem'
                                    wrap='wrap'
                                >
                                    <FormControl
                                        isInvalid={
                                            !!errors.subtasks?.at?.(idx)?.name
                                        }
                                        flex='4'
                                    >
                                        <FormLabel>Name</FormLabel>

                                        <Input
                                            {...register(
                                                `subtasks.${idx}.name`,
                                                {
                                                    required:
                                                        'Subtask must include a name',
                                                }
                                            )}
                                        />

                                        <FormErrorMessage>
                                            {
                                                errors.subtasks?.at?.(idx)?.name
                                                    ?.message
                                            }
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl flex='5'>
                                        <Flex>
                                            <FormLabel flex='1'>Due</FormLabel>

                                            <IconButton
                                                onClick={() =>
                                                    subtasksField.remove(idx)
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
                                            name={`subtasks.${idx}.due`}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Flex>
                            ))}

                            <IconButton
                                onClick={() =>
                                    subtasksField.append(DEFAULT_SUBTASK)
                                }
                                icon={<Plus color='dark' size={24} />}
                                colorScheme='accent'
                                alignSelf='center'
                                rounded='full'
                                aria-label='add vacation'
                            />

                            <Divider />

                            {/* description */}
                            <FormControl>
                                <FormLabel>Description (optional)</FormLabel>

                                <Textarea
                                    {...register('description')}
                                    rows={4}
                                />
                            </FormControl>
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
