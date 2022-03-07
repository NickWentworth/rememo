import { useState } from 'react';
import Link from 'next/link';
import styles from './sidebar.module.css';

const iconSize = 64;

export default function Sidebar({ tabData }) {
    const [extend, setExtend] = useState(true);

    const handleClick = () => {
        setExtend(!extend);
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarTop}>
                {tabData.map((data) => {
                    return (
                        <SidebarPanel name={data.tabName} link={data.tabPath} icon={data.iconPath} extend={extend}/>
                    )
                })}
            </div>

            <div className={styles.sidebarBottom}>
                <input className={styles.expandButton} type='image' src='/images/test.png' width={iconSize} height={iconSize} onClick={handleClick} />
            </div>
        </div>
    )
}

const SidebarPanel = ({ name, link, icon, extend }) => {
    return (
        <div className={styles.sidebarPanel}>
            <input type='image' src='images/test.png' width={iconSize} height={iconSize} layout='fixed' />

            <Link href={link}>
                <a className={styles.sidebarPanelText} style={{ display: extend ? 'block' : 'none' }}>
                    <h2>{name}</h2>
                </a>
            </Link>
        </div>
    )
}
