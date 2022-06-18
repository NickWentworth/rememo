import { useState } from 'react';
import { useObjectList } from '../components/hooks/useObjectList';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/sidebar';
import { getTermFormattedDate } from '../lib/dateUtility';
import styles from './classes.module.css';

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
                        <button>Add Term</button>
                        <h1>Terms</h1>

                        {terms.map((term) => (
                            <div
                                key={term.id}
                                className={styles.termPanel + ' boxShadowDark interactableHighlight'}
                                onClick={() => setFocusedTerm(term)}
                            >
                                <h2>{term.name}</h2>

                                <p>{getTermFormattedDate(term.startDate) + ' '}-{' ' + getTermFormattedDate(term.endDate)}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.verticalLine} />

                    <div className={styles.classSection}>
                        <button>Add Class</button>
                        <h1>Classes</h1>

                        <hr />

                        {focusedTerm == null && <p>Select a term to view its classes</p>}

                        {focusedTerm && classes.filter((c) => (c.termId == focusedTerm.id))
                            .map((_class) => (
                                <div key={_class.id} className={styles.classPanel + ' boxShadowDark'}>
                                    <h2 style={{ color: _class.color }}>{_class.name}</h2>

                                    {_class.instructor && <div className={styles.classPanelLine}>
                                        <Image src='/images/icons/personWhite.png' width={20} height={20} layout='fixed' priority />
                                        <p>{_class.instructor}</p>
                                    </div>}

                                    {_class.location && <div className={styles.classPanelLine}>
                                        <Image src='/images/icons/locationWhite.png' width={20} height={20} layout='fixed' priority />
                                        <p>{_class.location}</p>
                                    </div>}
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
