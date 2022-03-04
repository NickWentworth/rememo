import { useState } from 'react';
import Image from 'next/image';
import styles from './sidebar.module.css';

const iconSize = 90;

export default () => {
    const [extend, setExtend] = useState(true);

    const handleClick = () => {
        setExtend(!extend);
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarTop}>
                <SidebarPanel name='Yet Another Page' extend={extend} />
                <SidebarPanel name='Yet Another Page' extend={extend} />
                <SidebarPanel name='Yet Another Page' extend={extend} />
                <SidebarPanel name='Yet Another Page' extend={extend} />
            </div>

            <div className={styles.sidebarBottom}>
                <input className={styles.expandButton} type='image' src='/images/test.png' width={iconSize} height={iconSize} onClick={handleClick} />
            </div>
        </div>
    );
}

const SidebarPanel = ({ name, extend }) => {
    return (
        <div className={styles.sidebarPanel}>
            <Image src='/images/test.png' width={iconSize} height={iconSize} layout='fixed' />

            <p className={styles.sidebarPanelText} style={{ display: extend ? 'block' : 'none' }}>
                {name}
            </p>
        </div>
    );
}
