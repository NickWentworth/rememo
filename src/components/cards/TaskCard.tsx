import { Edit, Trash } from '@/components/icons';
import { TaskStatus, formatTaskDate } from '@/lib/date';
import { TaskPayload } from '@/lib/types';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import {
    Box,
    Card,
    CardBody,
    Checkbox,
    Divider,
    Flex,
    IconButton,
    Spacer,
    Stack,
    Tag,
    Text,
} from '@chakra-ui/react';

type TaskCardProps = {
    task: TaskPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
};

function statusToColor(status: TaskStatus) {
    switch (status) {
        case 'late':
            return 'red.400';
        case 'soon':
            return 'yellow.300';
        case 'ok':
            return undefined;
    }
}

export function TaskCard(props: TaskCardProps) {
    const { mutate: setTaskCompletion } =
        trpc.task.setTaskCompletion.useMutation();

    const onCheckboxChange = () => {
        setTaskCompletion({
            id: props.task.id,
            completed: !props.task.completed,
        });
    };

    const [hovering, setHovering] = useState(false);

    const dueFormat = formatTaskDate(props.task.due, props.task.completed);
    const dueColor = statusToColor(dueFormat.status);

    return (
        <Card
            direction='row'
            overflow='hidden'
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            opacity={props.task.completed ? '40%' : '100%'}
        >
            <Stack bg={props.task.course?.color ?? 'bg.200'} gap='0'>
                <IconButton
                    icon={<Edit color='dark' size={20} />}
                    onClick={props.onEditClick}
                    rounded='0'
                    variant='ghost'
                    opacity={hovering ? '100%' : '0%'}
                    aria-label='edit'
                />

                <IconButton
                    icon={<Trash color='dark' size={20} />}
                    onClick={props.onDeleteClick}
                    rounded='0'
                    variant='ghost'
                    opacity={hovering ? '100%' : '0%'}
                    aria-label='delete'
                />
            </Stack>

            <CardBody>
                <Stack divider={<Divider />}>
                    <Box>
                        <Flex gap='0.5rem'>
                            <Checkbox
                                size='lg'
                                isChecked={props.task.completed}
                                onChange={onCheckboxChange}
                            />

                            <Text variant='h1'>{props.task.name}</Text>

                            <Spacer />

                            <Text variant='h3' color={props.task.course?.color}>
                                {props.task.course?.name}
                            </Text>
                        </Flex>

                        <Text color={dueColor}>{dueFormat.str}</Text>
                    </Box>

                    {props.task.subtasks.length > 0 && (
                        <Stack gap='0.5rem'>
                            {props.task.subtasks.map((subtask) => (
                                <TaskCardSubtaskRow
                                    key={subtask.id}
                                    subtask={subtask}
                                />
                            ))}
                        </Stack>
                    )}

                    {props.task.description && (
                        <Text whiteSpace='pre-wrap'>
                            {props.task.description}
                        </Text>
                    )}
                </Stack>
            </CardBody>
        </Card>
    );
}

type TaskCardSubtaskRowProps = {
    subtask: TaskPayload['subtasks'][number];
};

function TaskCardSubtaskRow(props: TaskCardSubtaskRowProps) {
    const { mutate: setSubtaskCompletion } =
        trpc.task.setSubtaskCompletion.useMutation();

    const onCheckboxChange = () =>
        setSubtaskCompletion({
            id: props.subtask.id,
            completed: !props.subtask.completed,
        });

    const dueFormat = formatTaskDate(
        props.subtask.due,
        props.subtask.completed
    );
    const dueColor = statusToColor(dueFormat.status);

    return (
        <Flex gap='0.5rem' opacity={props.subtask.completed ? '60%' : '100%'}>
            <Checkbox
                isChecked={props.subtask.completed}
                onChange={onCheckboxChange}
            />

            <Text variant='h3'>{props.subtask.name}</Text>

            <Tag rounded='full'>
                <Text color={dueColor}>{dueFormat.str}</Text>
            </Tag>
        </Flex>
    );
}
