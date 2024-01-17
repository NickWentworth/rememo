import SignOutButton from '@/components/SignOutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Index() {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <p>Verified user data:</p>
            <pre>{JSON.stringify(session, null, 4)}</pre>
            <SignOutButton />
        </div>
    );
}
