import { useUser } from '../lib/hooks/useUser';
import Head from 'next/head';
import { UserForm } from '../components/forms';
import { Sidebar } from '../components/sidebar';
import { Loading } from '../components/Loading';

export default function Settings() {
    const [user, userFunctions] = useUser();

    return (
        <>
            <Head>
                <title>Courses • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />

                {user == null
                    ? <Loading />
                    : <UserForm editingData={user} edit={userFunctions.edit} del={userFunctions.delete} />
                }
            </div>
        </>
    )
}
