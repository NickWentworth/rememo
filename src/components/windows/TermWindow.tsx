'use client';

import { TermCard } from '../cards';
import { TermForm } from '../forms';
import { TermPayload } from '@/lib/types';
import { deleteCourse } from '@/lib/actions/courses';
import { useTermData } from '../providers';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type TermWindowProps = {
    onTermCardClick: (id: string) => void;
    selectedTermId: string;
};

export function TermWindow(props: TermWindowProps) {
    const { data: terms } = useTermData();
    const termFormState = useFormState<TermPayload>();

    return (
        <>
            <div className={`${styles.window} ${styles.term}`}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>Terms</h1>

                        <button
                            className={styles.addButton}
                            onClick={termFormState.create}
                        >
                            <h1>+</h1>
                        </button>
                    </div>
                </div>

                <div className={styles.list}>
                    {terms.map((t) => (
                        <TermCard
                            key={t.id}
                            term={t}
                            onEditClick={() => termFormState.update(t)}
                            onDeleteClick={() => deleteCourse(t.id)}
                            selected={t.id === props.selectedTermId}
                            onClick={() => props.onTermCardClick?.(t.id)}
                        />
                    ))}
                </div>
            </div>

            <TermForm
                state={termFormState.formState}
                onCloseClick={termFormState.close}
            />
        </>
    );
}
