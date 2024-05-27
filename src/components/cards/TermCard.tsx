import { CardIcons } from './CardIcons';
import { Icon } from '@/components/Icon';
import { TermPayload } from '@/lib/types';
import { formatTermDate, formatTermVacationDate } from '@/lib/date';
import { useState } from 'react';
import { Card, CardBody, Flex, Stack, Text } from '@chakra-ui/react';

type TermCardProps = {
    term: TermPayload;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    selected: boolean;
    onClick?: () => void;
};

export function TermCard(props: TermCardProps) {
    const [hovering, setHovering] = useState(false);

    return (
        <Card
            direction='row'
            overflow='hidden'
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            borderWidth='2px'
            borderColor={props.selected ? 'bg.50' : 'transparent'}
        >
            <CardBody onClick={props.onClick} cursor='pointer'>
                <Stack>
                    <Text variant='h1'>{props.term.name}</Text>

                    <Flex gap='0.25rem' align='center'>
                        <Icon icon='calendar' variant='light' />

                        <Text>
                            {formatTermDate(props.term.start, props.term.end)}
                        </Text>
                    </Flex>

                    {props.term.vacations.length > 0 && (
                        <Stack gap='0.25rem'>
                            {props.term.vacations.map((vacation) => (
                                <Text key={vacation.id}>
                                    <Text as='span' color='bg.50'>
                                        {vacation.name}
                                    </Text>

                                    {' | '}

                                    {formatTermVacationDate(
                                        vacation.start,
                                        vacation.end
                                    )}
                                </Text>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </CardBody>

            <CardIcons
                hovering={hovering}
                iconVariant='white'
                onEditClick={props.onEditClick}
                onDeleteClick={props.onDeleteClick}
            />
        </Card>
    );
}
