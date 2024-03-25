import styles from './structure.module.css';

type FormFieldProps = {
    label: string;
    optional?: boolean;
    children: React.ReactNode;
};

export function FormField(props: FormFieldProps) {
    const label = `${props.label}${props.optional ? ' (optional)' : ''}`;

    return (
        <label className={styles.label}>
            {label}
            {props.children}
        </label>
    );
}
