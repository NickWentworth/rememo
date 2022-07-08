import { useState } from 'react';
import { useObjectList } from '../lib/hooks/useObjectList';
import Head from 'next/head';
import { Sidebar } from '../components/sidebar';
import { Loading } from '../components';
import { Term, Course } from '../components/cards';
import { TermForm, CourseForm } from '../components/forms';
import { SectionHeader } from '../components/SectionHeader';
import styles from '../styles/pages.module.css';

export default function Courses() {
    const [terms, termFunctions] = useObjectList('term');
    const [focusedTerm, setFocusedTerm] = useState(null);
    const [editingTerm, setEditingTerm] = useState(null);

    const [courses, courseFunctions] = useObjectList('course');
    const [editingCourse, setEditingCourse] = useState(null);

    return (
        <>
            <Head>
                <title>Courses • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                
                {terms == null || courses == null
                    ? <Loading />
                    : <>
                        <TermForm
                            editingData={editingTerm}
                            add={termFunctions.add}
                            edit={termFunctions.edit}
                            nullEditingData={() => setEditingTerm(null)}
                        />
        
                        <CourseForm
                            editingData={editingCourse}
                            add={courseFunctions.add}
                            edit={courseFunctions.edit}
                            nullEditingData={() => setEditingCourse(null)}
                            focusedTermId={focusedTerm?.id || ''}
                            terms={terms}
                        />

                        <div className={styles.content}>
                            <div className={styles.section + ' ' + styles.terms}>
                                <SectionHeader title='Terms' onAddClicked={() => setEditingTerm({})} />

                                {terms.length == 0
                                    ? <p>Click above to add a term</p>
                                    : terms.map((term) => (
                                        <div key={term.id} onClick={() => setFocusedTerm(term)}>
                                            <Term
                                                term={term}
                                                focused={focusedTerm == term}
                                                onEditClick={() => setEditingTerm(term)}
                                                onDeleteClick={async () => {
                                                    // wait to delete term to allow for container div setFocusedTerm() call to finish before nulling it again
                                                    await termFunctions.delete(term);
                                                    setFocusedTerm(null);
                                                }}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                            
                            <div className='verticalRuleLight' />

                            <div className={styles.section + ' ' + styles.courses}>
                                <SectionHeader title='Courses' onAddClicked={() => setEditingCourse({})} />

                                {focusedTerm == null && <p>Select a term to view its courses</p>}

                                {focusedTerm && courses.filter((c) => (c.termId == focusedTerm.id))
                                    .map((course) => (
                                        <Course
                                            key={course.id}
                                            course={course}
                                            onEditClick={() => setEditingCourse(course)}
                                            onDeleteClick={() => courseFunctions.delete(course)}
                                        />
                                    ))
                                }

                                {focusedTerm && courses.filter((c) => (c.termId == focusedTerm.id)).length == 0 && <p>No courses for this term yet</p>}
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}
