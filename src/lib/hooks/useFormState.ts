import { useState } from 'react';

export type FormState<T> = FormClosed | FormCreate | FormUpdate<T>;

type FormClosed = {
    mode: 'closed';
};

type FormCreate = {
    mode: 'create';
};

type FormUpdate<T> = {
    mode: 'update';
    data: T;
};

/**
 * Provides a form state and methods to interact with the form state. The form state should be provided to
 * a form's props to allow it to handle being open/closed
 *
 * `close()`: close the form
 *
 * `create()`: open the form in create mode, creating a new default item
 *
 * `update(initial)`: open the form in update mode, taking in some initial data that can be modified
 */
export function useFormState<T>() {
    const [formState, setFormState] = useState<FormState<T>>({
        mode: 'closed',
    });

    function close() {
        setFormState({
            mode: 'closed',
        });
    }

    function create() {
        setFormState({
            mode: 'create',
        });
    }

    function update(initial: T) {
        setFormState({
            mode: 'update',
            data: initial,
        });
    }

    return { formState, close, create, update };
}
