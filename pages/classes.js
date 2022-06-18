import { useState } from 'react';
import { useObjectList } from '../components/hooks/useObjectList';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/sidebar';
import { getTermFormattedDate } from '../lib/dateUtility';
import styles from './classes.module.css';

// TODO - separate class and term panels into separate components

export default function Classes() {
    const [terms, termFunctions] = useObjectList('term');
    const [classes, classFunctions] = useObjectList('class');
    const [focusedTerm, setFocusedTerm] = useState(null);
    
    // TODO - add loading component
    if (terms == null || classes == null) {
        return 'Loading...'
    }

    return (
        <>
            <Head>
                <title>Classes • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                
                <div className={styles.content}>
                    <div className={styles.termSection}>
                        <div className={styles.header}>
                            <h1>Terms</h1>

                            <hr />

                            <Image className={styles.addButtonImage + ' interactableHighlight'} src='/images/icons/addWhite.png' width={40} height={40}/>
                        </div>

                        {terms.map((term) => (
                            <div
                                key={term.id}
                                className={styles.termPanel + ' boxShadowDark interactableHighlight'}
                                onClick={() => setFocusedTerm(term)}
                                style={{ border: (focusedTerm == term) ? '3px solid var(--white)' : '3px solid transparent' }}
                            >
                                <div>
                                    <h2>{term.name}</h2>

                                    <p>{getTermFormattedDate(term.startDate) + ' - ' + getTermFormattedDate(term.endDate)}</p>
                                </div>

                                <div className={styles.panelIcons}>
                                    <Image className='interactableHighlight50' src='/images/icons/editWhite.png' width={30} height={30} layout='fixed' />
                                    <Image className='interactableHighlight50' src='/images/icons/deleteWhite.png' width={30} height={30} layout='fixed' />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.verticalLine} />

                    <div className={styles.classSection}>
                        <div className={styles.header}>
                            <h1>Classes</h1>

                            <hr />

                            <Image className={styles.addButtonImage + ' interactableHighlight'} src='/images/icons/addWhite.png' width={45} height={45}/>
                        </div>

                        {focusedTerm == null && <p>Select a term to view its classes</p>}

                        {focusedTerm && classes.filter((c) => (c.termId == focusedTerm.id))
                            .map((_class) => (
                                <div key={_class.id} className={styles.classPanel + ' boxShadowDark'}>
                                    <div>
                                        <h2 style={{ color: _class.color }}>{_class.name}</h2>

                                        {_class.instructor && <div className={styles.classPanelLine}>
                                            <Image src='/images/icons/personWhite.png' width={23} height={23} layout='fixed' priority />
                                            <p>{_class.instructor}</p>
                                        </div>}

                                        {_class.location && <div className={styles.classPanelLine}>
                                            <Image src='/images/icons/locationWhite.png' width={23} height={23} layout='fixed' priority />
                                            <p>{_class.location}</p>
                                        </div>}
                                    </div>

                                    <div className={styles.panelIcons}>
                                        <Image className='interactableHighlight50' src='/images/icons/editWhite.png' width={30} height={30} layout='fixed' />
                                        <Image className='interactableHighlight50' src='/images/icons/deleteWhite.png' width={30} height={30} layout='fixed' />
                                    </div>
                                </div>
                            ))
                        }

                        {focusedTerm && classes.filter((c) => (c.termId == focusedTerm.id)).length == 0 && <p>No classes for this term yet</p>}
                    </div>
                </div>
            </div>
        </>
    )
}
