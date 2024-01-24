import Providers from '@/providers';
import Sidebar from '@/components/Sidebar';
import '../global.css';

// Pages in the (protected) layout group require the user to be signed into an active session.
// They also automatically include a sidebar component along with the page content

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
