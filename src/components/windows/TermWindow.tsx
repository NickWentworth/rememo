'use client';

import { Plus } from '../icons';
import { TermCard } from './cards';
import { TermForm } from './forms';
import Button from '@/components/Button';
import { TermPayload } from '@/lib/types';
import { useTermMutations, useAllTerms } from '@/lib/query/terms';
import { useFormState } from '@/lib/hooks/useFormState';
import styles from './window.module.css';

type TermWindowProps = {
    selectedTermId?: string;
    setSelectedTermId: (id?: string) => void;
};

export function TermWindow(props: TermWindowProps) {
    const { data: terms, status } = useAllTerms();
    const { remove: deleteTerm } = useTermMutations();

    const termFormState = useFormState<TermPayload>();

    const list = () => {
        if (status === 'error') {
            return <p>Error!</p>;
        }

        if (status === 'pending') {
            return <p>Loading...</p>;
        }

        // display message if no terms exist
        if (terms.length == 0) {
            return <p>No terms yet, add one with the button above!</p>;
        }

        // by default, return all terms mapped to a card component
        return terms.map((term) => (
            <TermCard
                key={term.id}
                term={term}
                onEditClick={() => termFormState.update(term)}
                onDeleteClick={() => {
                    if (props.selectedTermId === term.id) {
                        props.setSelectedTermId(undefined);
                    }
                    deleteTerm(term.id);
                }}
                selected={term.id === props.selectedTermId}
                onClick={() => props.setSelectedTermId(term.id)}
            />
        ));
    };

    return (
        <>
            <div className={`${styles.window} ${styles.term}`}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h1>Terms</h1>

                        <Button
                            type='solid'
                            onClick={termFormState.create}
                            icon={<Plus size={20} color='dark' />}
                            border='round'
                        />
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
