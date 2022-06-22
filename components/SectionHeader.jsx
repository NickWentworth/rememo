import styles from './SectionHeader.module.css';

export function SectionHeader({ title, onAddClicked }) {
    return (
        <div className={styles.header}>
            <h1>{title}</h1>

            <hr />

            <img
                className={styles.addButtonImage + ' interactableHighlight'}
                src='/images/icons/addWhite.png'
                width={45} height={45}
                onClick={() => onAddClicked()}
            />
        </div>
    )
}
