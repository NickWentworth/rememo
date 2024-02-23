import { useEffect, useState } from 'react';
import { nowUTC } from '../date';

// how often to update the current time
const UPDATE_MS = 10 * 1000;

/**
 * Provides a `Date` object automatically kept updated to the current time
 */
export function useCurrentTime() {
    const [time, setTime] = useState(nowUTC());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(nowUTC());
        }, UPDATE_MS);

        return () => clearInterval(interval);
    }, []);

    return time;
}
