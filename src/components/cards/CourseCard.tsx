import { Icon } from '@/components/Icon';
import { formatCourseTimeDays, formatCourseTimeRange } from '@/lib/date';
import { CoursePayload } from '@/lib/types';
import { bitfieldToList } from '@/lib/bitfield';
import { useState } from 'react';
import {
    Card,
    CardBody,
    Grid,
    IconButton,
    Stack,
    Text,
} from '@chakra-ui/react';

type CourseCardProps = {
    course: CoursePayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
};

export function CourseCard(props: CourseCardProps) {
    const [hovering, setHovering] = useState(false);

    return (
        <Card
            direction='row'
            overflow='hidden'
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <CardBody>
                <Stack>
                    <Text variant='h1' color={props.course.color}>
                        {props.course.name}
                    </Text>

                    <Grid
                        templateColumns='auto 1fr'
                        gap='0.25rem'
                        alignItems='center'
                    >
                        {props.course.instructor && (
                            <>
                                <Icon icon='user' />
                                <Text>{props.course.instructor}</Text>
                            </>
                        )}

                        {props.course.location && (
                            <>
                                <Icon icon='location' />
                                <Text>{props.course.location}</Text>
                            </>
                        )}
                    </Grid>

                    <Stack gap='0.25rem'>
                        {props.course.times.map((time) => (
                            <Text key={time.id}>
                                <Text as='span' color='bg.50'>
                                    {formatCourseTimeRange(
                                        time.start,
                                        time.end
                                    )}
                                </Text>

                                {' | '}

                                {formatCourseTimeDays(
                                    bitfieldToList(time.days)
                                )}
                            </Text>
                        ))}
                    </Stack>
                </Stack>
            </CardBody>

            <Stack gap='0'>
                <IconButton
                    icon={<Icon icon='edit' variant='white' fontSize='lg' />}
                    onClick={props.onEditClick}
                    rounded='0'
                    variant='ghost'
                    opacity={hovering ? '100%' : '0%'}
                    aria-label='edit'
                />

                <IconButton
                    icon={<Icon icon='trash' variant='white' fontSize='lg' />}
                    onClick={props.onDeleteClick}
                    rounded='0'
                    variant='ghost'
                    opacity={hovering ? '100%' : '0%'}
                    aria-label='delete'
                />
            </Stack>
        </Card>
    );
}
