import { Close } from '@/components/icons';
import Button from '@/components/Button';
import { buildClass } from '@/lib/utils';
import { createContext, useContext, useState } from 'react';
import styles from './toast.module.css';

type Toast = {
    severity: 'error' | 'warning' | 'success' | 'info';
    msg: string;
};

// unique id is required to properly map toasts and reliably remove them
type ToastWithId = Toast & { id: string };

type ToastController = {
    send: (t: Toast) => void;
};

const ToastContext = createContext<ToastController | undefined>(undefined);

const DISPLAY_MS = 5000;

export function ToastProvider(props: React.PropsWithChildren) {
    const [toasts, setToasts] = useState<ToastWithId[]>([]);

    // adds a toast message
    function send(t: Toast) {
        // give toast a random id for a key
        const id = crypto.randomUUID();

        // add this toast to the end of the queue
        setToasts((curr) => [...curr, { ...t, id }]);

        // and remove this toast after some time
        setTimeout(() => {
            remove(id);
        }, DISPLAY_MS);
    }

    // removes a toast message by its id
    // only available to this provider, used by individual toast components
    function remove(id: string) {
        setToasts((curr) => curr.filter((toast) => toast.id !== id));
    }

    return (
        <ToastContext.Provider value={{ send }}>
            <div className={styles.container}>
                {toasts.map((toast) => {
                    const cn = buildClass(
                        styles.message,
                        styles[toast.severity]
                    );

                    return (
                        <div key={toast.id} className={cn}>
                            <h3>{toast.msg}</h3>

                            <Button
                                type='transparent'
                                onClick={() => remove(toast.id)}
                                border='round'
                                icon={
                                    <Close size={20} color='dark' stroke={1} />
                                }
                            />
                        </div>
                    );
                })}
            </div>

            {props.children}
        </ToastContext.Provider>
    );
}

export function useToastController() {
    const context = useContext(ToastContext);

    if (context === undefined) {
        throw new Error('ToastContext is not available to this component!');
    }

    return context;
}
