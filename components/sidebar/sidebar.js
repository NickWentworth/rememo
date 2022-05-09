import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from './sidebar.module.css';

// TODO - maintain sidebar extend state between pages
// TODO - possibly use next router to check current tab

const iconPath = '/images/icons/';
const iconSize = 50;

export function Sidebar() {
    const [extend, setExtend] = useState(false);
    const router = useRouter();

    return (
        <nav className={styles.sidebar + ' boxShadowDark'}>
            <div className={styles.sidebarTop}>
                <SidebarPanel
                    name={'Dashboard'}
                    link={'/dashboard'}
                    icon={`${iconPath}dashboard.svg`}
                    extend={extend}
                    focused={router.asPath === '/dashboard'}
                />

                <hr />

                <SidebarPanel
                    name={'Tasks'}
                    link={'/tasks'}
                    icon={`${iconPath}tasks.svg`}
                    extend={extend}
                    focused={router.asPath === '/tasks'}
                />
                
                <hr />

                <SidebarPanel
                    name={'Notes'}
                    link={'/notes'}
                    icon={`${iconPath}notes.svg`}
                    extend={extend}
                    focused={router.asPath === '/notes'}
                />

                <hr />
            </div>

            <div className={styles.sidebarBottom}>
                <div className={styles.expandButtonWrapper + ' interactableHighlight'}>
                    <Image
                        src='/images/icons/hamburger.svg'
                        width={iconSize}
                        height={iconSize}
                        onClick={setExtend.bind(this, !extend)}
                    />
                </div>
            </div>
        </nav>
    )
}

function SidebarPanel({ name, link, icon, extend, focused }) {
    return (
        <Link href={link}>
            <a>
                <div className={styles.sidebarPanel + ' interactableHighlight'}>
                    <Image src={focused ? icon.replace('.svg', 'A.svg') : icon} width={iconSize} height={iconSize} priority />

                    <h3 className={styles.sidebarPanelText + (focused ? ' accentColor' : '')} hidden={!extend}>{name}</h3>
                </div>
            </a>
            
        </Link>
    )
}
