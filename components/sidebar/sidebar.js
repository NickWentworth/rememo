import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { UserPanel } from './userPanel';
import styles from './sidebar.module.css';

// TODO - maintain sidebar extend state between pages
// TODO - possibly use next router to check current tab

const iconPath = '/images/icons/';
const iconSize = 50;

export function Sidebar() {
    const [extend, setExtend] = useState(true);
    const router = useRouter();

    return (
        <nav className={styles.sidebar + ' boxShadowDark'}>
            <div className={styles.sidebarTop}>
                <SidebarPanel
                    name={'Dashboard'}
                    link={'/dashboard'}
                    iconPath={'/images/icons/dashboard.png'}
                    extend={extend}
                    focused={router.asPath === '/dashboard'}
                />

                <hr />

                <SidebarPanel
                    name={'Tasks'}
                    link={'/tasks'}
                    iconPath={'/images/icons/tasks.png'}
                    extend={extend}
                    focused={router.asPath === '/tasks'}
                />
                
                <hr />

                <SidebarPanel
                    name={'Courses'}
                    link={'/courses'}
                    iconPath={'/images/icons/courses.png'}
                    extend={extend}
                    focused={router.asPath === '/courses'}
                />

                <hr />
            </div>

            <div className={styles.sidebarBottom}>
                <hr />
                
                <UserPanel extend={extend} />
                
                <hr />

                <div className={styles.expandButtonWrapper + ' interactableHighlight'} onClick={setExtend.bind(this, !extend)}>
                    <Image
                        src='/images/icons/menuWhite.png'
                        width={iconSize}
                        height={iconSize}
                        layout='fixed'
                    />
                </div>
            </div>
        </nav>
    )
}

function SidebarPanel({ name, link, iconPath, extend, focused }) {
    return (
        <Link href={link}>
            <a>
                <div className={styles.sidebarPanel + ' interactableHighlight'}>
                    <Image src={iconPath.replace('.png', focused ? 'Accent.png' : 'White.png')} width={iconSize} height={iconSize} layout='fixed' priority />

                    <h3 className={styles.sidebarPanelText + (focused ? ' accentColor' : '')} hidden={!extend}>{name}</h3>
                </div>
            </a>
            
        </Link>
    )
}
