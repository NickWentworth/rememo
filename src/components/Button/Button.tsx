import styles from './button.module.css';

type ClassValue = string | boolean | undefined;

function buildClass(...classes: ClassValue[]): string {
    return classes.filter((c) => c !== false ?? false).join(' ');
}

type ButtonProps = {
    type: 'solid' | 'outline' | 'transparent';
    onClick?: () => void;
    disabled?: boolean;

    /** Apply a differently shaped border than the usual slight border radius */
    border?: 'round' | 'square';

    /** Apply the usual padding, ignoring whether or not there is only an icon */
    usualPadding?: boolean;

    /** For forms, is this button acting as a submit button? */
    submit?: boolean;

    /** Icon to display to the left of the text */
    icon?: React.ReactElement;
    /** Main text component displayed by the button */
    children?: string | string[];
};

export default function Button(props: ButtonProps) {
    const className = buildClass(
        styles.button,
        styles[props.type],
        props.border === 'round' && styles.round,
        props.border === 'square' && styles.square,
        props.icon && !props.children && !props.usualPadding && styles.iconOnly
    );

    return (
        <button
            className={className}
            onClick={props.onClick}
            disabled={props.disabled}
            type={props.submit ? 'submit' : 'button'}
        >
            {props.icon}

            {props.children && (
                <h3 className={styles.text}>{props.children}</h3>
            )}
        </button>
    );
}
