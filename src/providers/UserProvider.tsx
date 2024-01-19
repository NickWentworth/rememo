'use client';

import { User } from '@prisma/client';
import { createContext, useContext } from 'react';

const UserContext = createContext<User | undefined>(undefined);

type UserProviderProps = {
    user: User;
    children: React.ReactNode;
};

export default function UserProvider(props: UserProviderProps) {
    return (
        <UserContext.Provider value={props.user}>
            {props.children}
        </UserContext.Provider>
    );
}

export function useUser(): User {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('User data is not accessible to this component!');
    }

    return context;
}
