import { useState } from 'react';

type TypedSelectProps<T extends string> = {
    options: TypedSelectOption<T>[];
    onChange: (value: T) => void;
};

type TypedSelectOption<T> = {
    value: T;
    display: string;
};

export default function TypedSelect<T extends string>(
    props: TypedSelectProps<T>
) {
    if (props.options.length === 0) {
        console.warn('Select component is not given any options to display!');
    }

    // controlled select state
    const [value, setValue] = useState(props.options.at(0)?.value);

    // list of possible values that the select state can take control of
    const values = props.options.map((opt) => opt.value);

    // determines if the given string is a valid string (to send back to the onChange prop)
    function isValid(s: string): s is T {
        return values.some((v) => v === s);
    }

    return (
        <select
            value={value}
            onChange={(e) => {
                // e.target.value's type T is lost when given to option's value prop, ensure an option has not been changed
                if (!isValid(e.target.value)) {
                    console.error(
                        `Selected value '${e.target.value}' is not a valid option contained in [${values}]`
                    );
                    return;
                }

                setValue(e.target.value);
                props.onChange(e.target.value);
            }}
        >
            {props.options.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                    {opt.display}
                </option>
            ))}
        </select>
    );
}
