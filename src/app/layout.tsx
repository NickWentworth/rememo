import Providers from '@/providers';
import Sidebar from '@/components/Sidebar';
import './global.css';

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
