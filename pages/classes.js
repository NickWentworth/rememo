import { useState } from 'react';
import { useObjectList } from '../components/hooks/useObjectList';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/sidebar';
import { Term, Course } from '../components/cards';
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
                            <div key={term.id} onClick={() => setFocusedTerm(term)}>
                                <Term
                                    term={term}
                                    focused={focusedTerm == term}
                                />
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
                                <Course key={_class.id} course={_class} />
                            ))
                        }

                        {focusedTerm && classes.filter((c) => (c.termId == focusedTerm.id)).length == 0 && <p>No classes for this term yet</p>}
                    </div>
                </div>
            </div>
        </>
    )
}
