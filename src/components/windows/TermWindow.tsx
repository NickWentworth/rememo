'use client';

import { TermCard } from '../cards';
import { TermForm } from '../forms';
import { TermPayload } from '@/lib/types';
import { deleteTerm } from '@/lib/actions/terms';
import { useTerms } from '@/providers';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type TermWindowProps = {
    onTermCardClick: (id: string) => void;
    selectedTermId?: string;
};

export function TermWindow(props: TermWindowProps) {
    const { data: terms } = useTerms();
    const termFormState = useFormState<TermPayload>();

    const list = () => {
        // display message if no terms exist
        if (terms.length == 0) {
            return <p>No terms yet, add one with the button above!</p>;
        }

        // by default, return all terms mapped to a card component
        return terms.map((t) => (
            <TermCard
                key={t.id}
                term={t}
                onEditClick={() => termFormState.update(t)}
                onDeleteClick={() => deleteTerm(t.id)}
                selected={t.id === props.selectedTermId}
                onClick={() => props.onTermCardClick?.(t.id)}
            />
        ));
    };

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

                <div className={styles.list}>{list()}</div>
            </div>

            <TermForm
                state={termFormState.formState}
                onCloseClick={termFormState.close}
            />
        </>
    );
}
