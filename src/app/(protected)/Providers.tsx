import { ToastProvider } from './ToastProvider';
import { QueryProvider } from './QueryProvider';

export default function Providers(props: React.PropsWithChildren) {
    return (
        <ToastProvider>
            <QueryProvider>{props.children}</QueryProvider>
        </ToastProvider>
    );
}
