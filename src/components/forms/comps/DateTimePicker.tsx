import { dateISO, timeISO, updateDate, updateTime } from '@/lib/date';
import { Input, SimpleGrid } from '@chakra-ui/react';

type DateTimePickerProps = {
    // fields from controller component
    value: Date;
    onChange: (date: Date) => void;
    // optionally hide either date or time element
    hideDate?: boolean;
    hideTime?: boolean;
};

export function DateTimePicker(props: DateTimePickerProps) {
    return (
        <SimpleGrid autoColumns='1fr' gridAutoFlow='column'>
            {!props.hideDate && (
                <Input
                    type='date'
                    value={dateISO(props.value)}
                    onChange={(e) =>
                        props.onChange(updateDate(props.value, e.target.value))
                    }
                />
            )}

            {!props.hideTime && (
                <Input
                    type='time'
                    value={timeISO(props.value)}
                    onChange={(e) =>
                        props.onChange(updateTime(props.value, e.target.value))
                    }
                />
            )}
        </SimpleGrid>
    );
}
