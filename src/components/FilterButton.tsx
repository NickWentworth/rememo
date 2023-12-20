import styles from './filterButton.module.css';

type FilterButtonProps = {
    active: boolean;
    name: string;
    count: number;
    onClick?: () => void;
};

export function FilterButton(props: FilterButtonProps) {
    // applies the .active class if this filter is active
    const active = (c: string) => (props.active ? `${c} ${styles.active}` : c);

    return (
        <button className={styles.button} onClick={props.onClick}>
            <p className={active(styles.name)}>{props.name}</p>

            <h3 className={active(styles.count)}>{props.count}</h3>

            <div className={active(styles.bar)} />
        </button>
    );
}
