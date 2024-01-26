import Providers from '@/providers';
import Sidebar from '@/components/Sidebar';
import { buildMetadata } from '@/lib/metadata';
import '../global.css';

// Pages in the (protected) layout group require the user to be signed into an active session.

// Any pages located in this layout group have access to user data.

// They also automatically include a sidebar component along with the page content.

export const metadata = buildMetadata();

type LayoutProps = {
    children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
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
