import styles from './button.module.css';

type ButtonProps = {
    type: 'solid' | 'outline' | 'transparent';
    onClick?: () => void;
    disabled?: boolean;

    /** Icon to display to the left of the text */
    icon?: React.ReactElement;
    /** Main text component displayed by the button */
    children?: string;
};

export default function Button(props: ButtonProps) {
    const className = `${styles.button} ${styles[props.type]}`;

    return (
        <button
            className={className}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.icon}
            <h3 className={styles.text}>{props.children}</h3>
        </button>
    );
}
