import { buildMetadata } from '@/lib/metadata';
import './global.css';

// Default root layout, nothing special, just html and body tags and a default metadata export

export const metadata = buildMetadata();

export default async function Layout(props: React.PropsWithChildren) {
    return (
        <html>
            <body>{props.children}</body>
        </html>
    );
}
