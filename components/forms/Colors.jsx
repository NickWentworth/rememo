import { useEffect, useState } from 'react';
import styles from './forms.module.css';

export function Colors({ colors, value, onChange }) {
    const [selected, setSelected] = useState(value || colors[0]); // default to first color

    useEffect(() => {
        setSelected(value || colors[0]);
    }, [value])

    function handleChange(color) {
        setSelected(color);
        onChange({
            target: {
                name: 'color',
                value: color
            }
        })
    }

    return (
        <div className={styles.colorsContainer}>
            {colors.map((color) => (
                <div
                    key={color}
                    className={styles.colorOption + ' interactable'}
                    onClick={() => handleChange(color)}
                    style={{ borderColor: (selected === color) ? 'var(--white)' : 'transparent' }}
                >
                    <div className={styles.colorOptionInner} style={{ backgroundColor: color }} />
                </div>
            ))}
        </div>
    )
}
