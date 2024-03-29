import Providers from './Providers';
import Sidebar from '@/components/Sidebar';
import { buildMetadata } from '@/lib/metadata';
import { LOGIN_ROUTE, isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import '../global.css';

// Pages in the (protected) layout group require the user to be signed into an active session.

// They also automatically include a sidebar component along with the page content.

export const metadata = buildMetadata();

type LayoutProps = {
    children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
    // redirect is user is unauthenticated
    if (!(await isAuthenticated())) {
        redirect(LOGIN_ROUTE);
    }

    return (
        <html>
            <body>
                <Providers>
                    <Sidebar />
                    {props.children}
                </Providers>
            </body>
        </html>
    );
}
