import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { capitalize } from '../lib/utility.js';
import styles from './sidebar.module.css';

const iconSize = 64;

export default function Sidebar({ tabData, currentTab }) {
    const [extend, setExtend] = useState(true);

    const handleClick = () => {
        setExtend(!extend);
    }

    return (
        <nav className={styles.sidebar}>
            <div className={styles.sidebarTop}>
                {tabData.map((data) => {
                    return (
                        <SidebarPanel
                            key={data.tabName}
                            name={data.tabName}
                            link={data.tabPath}
                            icon={data.iconPath}
                            extend={extend}
                            focused={currentTab == data.tabName}
                        />
                    )
                })}
            </div>

            <div className={styles.sidebarBottom}>
                <input className={styles.expandButton} type='image' src='/images/test.png' width={iconSize} height={iconSize} onClick={handleClick} />
            </div>
        </nav>
    )
}

const SidebarPanel = ({ name, link, icon, extend, focused }) => {
    return (
        <div className={styles.sidebarPanel}>
            <p>{focused}</p>
            <Link href={link}>
                <a className={styles.sidebarPanelImage}>
                    <Image src={focused ? icon.replace('.png', 'Accent.png') : icon} width={iconSize} height={iconSize} layout='fixed' />
                </a>
            </Link>

            <Link href={link}>
                <a className={styles.sidebarPanelText} style={{ display: extend ? 'block' : 'none' }}>
                    <h2 className={focused ? 'accentColor' : ''}>
                        {capitalize(name)}
                    </h2>
                </a>
            </Link>
        </div>
    )
}
