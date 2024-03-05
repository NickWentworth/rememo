import styles from './panel.module.css';

type PanelProps = {
    header: React.ReactElement | React.ReactElement[];
    body: React.ReactElement | React.ReactElement[];

    /** relative width of the panel compared to other panels */
    flex: number;

    /** optional max width of body elements */
    width?: number;
};

export default function Panel(props: PanelProps) {
    // calculate padding for left and right of body if a width is given
    // take max between 1 rem and half of remaining space after width is removed
    const padding =
        props.width && `max(1rem, calc((100% - ${props.width}px) / 2))`;

    const bodyStyle: React.CSSProperties = {
        paddingLeft: padding,
        paddingRight: padding,
    };

    return (
        <>
            <div className={styles.vr} />

            <div className={styles.panel} style={{ flex: props.flex }}>
                <div className={styles.header}>{props.header}</div>

                <div className={styles.body} style={bodyStyle}>
                    {props.body}
                </div>
            </div>
        </>
    );
}
