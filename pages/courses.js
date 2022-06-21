import { useState } from 'react';
import { useObjectList } from '../components/hooks/useObjectList';
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/sidebar';
import { Term, Course } from '../components/cards';
import styles from './courses.module.css';
import { TermForm } from '../components/forms/TermForm';
import { CourseForm } from '../components/forms/CourseForm';

export default function Courses() {
    const [terms, termFunctions] = useObjectList('term');
    const [focusedTerm, setFocusedTerm] = useState(null);
    const [editingTerm, setEditingTerm] = useState(null);

    const [courses, courseFunctions] = useObjectList('course');
    const [editingCourse, setEditingCourse] = useState(null);
    
    // TODO - add loading component
    if (terms == null || courses == null) {
        return 'Loading...'
    }

    function log(data) {
        console.log('Submitted data: ');
        console.log(data);
    }

    return (
        <>
            <Head>
                <title>Courses • Rememo</title>
            </Head>

            <div className='page'>
                <Sidebar />
                
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
                    termId={focusedTerm?.id || ''}
                />
                
                <div className={styles.content}>
                    <div className={styles.termSection}>
                        <div className={styles.header}>
                            <h1>Terms</h1>

                            <hr />

                            <Image
                                className={styles.addButtonImage + ' interactableHighlight'}
                                src='/images/icons/addWhite.png'
                                width={40} height={40}
                                onClick={() => setEditingTerm({})}
                            />
                        </div>

                        {terms.map((term) => (
                            <div key={term.id} onClick={() => setFocusedTerm(term)}>
                                <Term
                                    term={term}
                                    focused={focusedTerm == term}
                                    onEditClick={() => setEditingTerm(term)}
                                    onDeleteClick={() => termFunctions.delete(term)}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.verticalLine} />

                    <div className={styles.courseSection}>
                        <div className={styles.header}>
                            <h1>Courses</h1>

                            <hr />

                            <Image
                                className={styles.addButtonImage + ' interactableHighlight'}
                                src='/images/icons/addWhite.png'
                                width={45} height={45}
                                onClick={() => setEditingCourse({})}
                            />
                        </div>

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
            </div>
        </>
    )
}
