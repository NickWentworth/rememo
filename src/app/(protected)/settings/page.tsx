import { SignOutButton } from '@/components/Button';
import { getServerUser } from '@/lib/auth';

export default async function Settings() {
    const user = await getServerUser();

    return (
        <div>
            <p>Verified user data:</p>
            <pre>{JSON.stringify(user, null, 4)}</pre>
            <SignOutButton />
        </div>
    );
}
