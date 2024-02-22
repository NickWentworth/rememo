'use client';

import { useEffect, useState } from 'react';
import styles from './search.module.css';

type SearchBarProps = {
    /** Callback function for when user stops typing */
    onTypingStop: (s: string) => void;

    /** How long to wait before calling `onTypingStop`? */
    waitTimeMs?: number;
};

const DEFAULT_TIMEOUT_MS = 500;

export default function SearchBar(props: SearchBarProps) {
    const [term, setTerm] = useState('');

    // on term being changed, reset timeout function
    useEffect(() => {
        const timer = setTimeout(
            () => props.onTypingStop(term),
            props.waitTimeMs ?? DEFAULT_TIMEOUT_MS
        );

        return () => clearTimeout(timer);
    }, [term]);

    return (
        <input
            type='text'
            className={styles.searchBar}
            placeholder='Search'
            value={term}
            onChange={(e) => setTerm(e.target.value)}
        />
    );
}
