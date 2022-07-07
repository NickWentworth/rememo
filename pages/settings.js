import { useState } from 'react';
import Head from 'next/head';
import { UserForm } from '../components/forms';
import { Sidebar } from '../components/sidebar';

export default function Settings() {
    const [user, setUser] = useState({ name: 'Nick', id: 'abcdef' });

    return (
        <>
            <Head>
                <title>Courses • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                <UserForm editingData={user} edit={setUser} del={() => console.log('deleting user')} />
            </div>
        </>
    )
}
