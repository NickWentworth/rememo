import { useSession } from 'next-auth/react';
import { Login } from './Login';
import { Loading } from '../Loading';

export function AuthHandler({ children }) {
    const { status } = useSession();

    switch (status) {
        case 'unauthenticated':
            return <Login />
        case 'loading':
            return <Loading />
        case 'authenticated':
            return children;
        default:
            console.log('next-auth status not recognized');
            return null;
    }
}
