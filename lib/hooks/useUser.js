import { useState, useEffect } from 'react';

const apiRoute = '/api/data/user';

// sort of a specialized version of useObjectList(), except always just a single user and methods are slightly different
export function useUser() {
    const [user, setUser] = useState(null);

    useEffect(async () => {
        let response = await fetch(apiRoute);
        let data = await response.json();

        if (!response.ok) {
            console.error(data.error);
            return;
        }

        setUser(data.data);
    }, [])

    const userFunctions = {
        edit: async (editedUser) => {
            let response = await fetch(apiRoute, {
                method: 'PUT',
                body: JSON.stringify({ data: editedUser })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setUser(data.data);
        },
        delete: async () => {
            let response = await fetch(apiRoute, {
                method: 'DELETE',
                body: JSON.stringify({ data: user })
            })
            let data = await response.json();

            if (!response.ok) {
                console.error(data.error);
                return;
            }

            setUser(null);
            location.reload();
        },
    }

    return [user, userFunctions]
}
