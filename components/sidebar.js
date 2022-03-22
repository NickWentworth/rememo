import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { capitalize } from '../lib/utility.js';
import styles from './sidebar.module.css';

const iconSize = 50;

export default function Sidebar({ tabData, currentTab }) {
    const [extend, setExtend] = useState(false);

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
                <input
                    className={styles.expandButton}
                    type='image'
                    src='/images/icons/hamburger.svg'
                    width={iconSize}
                    height={iconSize} 
                    onClick={handleClick} 
                />
            </div>
        </nav>
    )
}

const SidebarPanel = ({ name, link, icon, extend, focused }) => {
    return (
        <div className={styles.sidebarPanel}>
            <Link href={link}>
                <a className={styles.sidebarPanelImage}>
                    <Image src={focused ? icon.replace('.svg', 'A.svg') : icon} width={iconSize} height={iconSize} layout='fixed' />
                </a>
            </Link>

            <Link href={link}>
                <a className={styles.sidebarPanelText} style={{ display: extend ? 'block' : 'none' }}>
                    <h3 className={focused ? 'accentColor' : ''}>
                        {capitalize(name)}
                    </h3>
                </a>
            </Link>
        </div>
    )
}
