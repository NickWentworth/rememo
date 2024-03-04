import styles from './panel.module.css';

type PanelProps = {
    header: React.ReactElement | React.ReactElement[];
    body: React.ReactElement | React.ReactElement[];

    flex: number;
    align?: React.CSSProperties['alignItems'];
};

export default function Panel(props: PanelProps) {
    return (
        <>
            <div className={styles.vr} />

            <div className={styles.panel} style={{ flex: props.flex }}>
                <div className={styles.header}>{props.header}</div>

                <div
                    className={styles.body}
                    style={{ alignItems: props.align }}
                >
                    {props.body}
                </div>
            </div>
        </>
    );
}
