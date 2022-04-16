import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './sidebar.module.css';

// TODO - maintain sidebar extend state between pages

const iconPath = '/images/icons/';
const iconSize = 50;

export default function Sidebar({ currentTab }) {
    const [extend, setExtend] = useState(false);

    return (
        <nav className={styles.sidebar + ' boxShadowDark'}>
            <div className={styles.sidebarTop}>
                <SidebarPanel
                    name={'Dashboard'}
                    link={'/dashboard'}
                    icon={`${iconPath}dashboard.svg`}
                    extend={extend}
                    focused={currentTab === 'Dashboard'}
                />

                <SidebarPanel
                    name={'Tasks'}
                    link={'/tasks'}
                    icon={`${iconPath}tasks.svg`}
                    extend={extend}
                    focused={currentTab === 'Tasks'}
                />
                
                <SidebarPanel
                    name={'Notes'}
                    link={'/notes'}
                    icon={`${iconPath}notes.svg`}
                    extend={extend}
                    focused={currentTab === 'Notes'}
                />
            </div>

            <div className={styles.sidebarBottom}>
                <Image
                    className={styles.expandButton + ' interactable'}
                    type='image'
                    src='/images/icons/hamburger.svg'
                    width={iconSize}
                    height={iconSize} 
                    onClick={setExtend.bind(this, !extend)} 
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
                    <h3 className={focused ? 'accentColor' : ''}>{name}</h3>
                </a>
            </Link>
        </div>
    )
}
