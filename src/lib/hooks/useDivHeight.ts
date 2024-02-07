import { ElementRef, useEffect, useRef, useState } from 'react';

// TODO: would be neat to make this generic, so that any ElementRef<T> and attribute of that T can be used
/**
 * Returns a ref object for providing to a div element and a height variable that stores that div's height
 */
export function useDivHeight() {
    const ref = useRef<ElementRef<'div'>>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.offsetHeight);
        }
    }, [ref]);

    return [ref, height] as const;
}
