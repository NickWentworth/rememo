import { useState, useEffect } from 'react';

// Generic hook for using a list of objects as a state
// Mostly shared logic between tasks, classes, etc.
export function useObjectList(apiRoute) {
    const [state, setState] = useState(null);

    useEffect(async () => {
        let response = await fetch(`${apiRoute}`);
        let data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        setState(data.data);
    }, [])

    const stateFunctions = {
        add: async (addedObject) => {
            let response = await fetch(`${apiRoute}add`, {
                method: 'POST',
                body: JSON.stringify({ data: addedObject })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setState(state.concat(data.data));
        },
        delete: async (deletedObject) => {
            let response = await fetch(`${apiRoute}delete`, {
                method: 'POST',
                body: JSON.stringify({ data: deletedObject })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setState(state.filter((object) => (object.id != deletedObject.id)));
        },
        edit: async (editedObject) => {
            let response = await fetch(`${apiRoute}edit`, {
                method: 'POST',
                body: JSON.stringify({ data: editedObject })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setState(state.map((object) => {
                return (object.id == editedObject.id) ? data.data : object
            }));
        }
    }

    return [state, stateFunctions]
}