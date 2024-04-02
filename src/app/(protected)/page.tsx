import { redirect } from 'next/navigation';

export default function IndexPage() {
    // no index page as of now, redirect to dashboard
    redirect('/dashboard');
}
