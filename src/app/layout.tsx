import Sidebar from '@/components/Sidebar';
import './global.css';

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
    return (
        <html>
            <body>
                <Sidebar />
                {props.children}
            </body>
        </html>
    );
}
