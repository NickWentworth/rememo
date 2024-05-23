import { ChakraProvider } from '@/providers';
import { buildMetadata } from '@/lib/metadata';
import './global.css';

// Default root layout, nothing special, just html and body tags with a default metadata export

// Includes ChakraProvider so entire app can use chakra-ui elements

export const metadata = buildMetadata();

export default async function Layout(props: React.PropsWithChildren) {
    return (
        <html>
            <body>
                <ChakraProvider>{props.children}</ChakraProvider>
            </body>
        </html>
    );
}
