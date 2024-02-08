import { useCallback, useEffect, useRef, useState } from 'react';

type Element = keyof React.JSX.IntrinsicElements;
type Ref<E extends Element> = NonNullable<React.ElementRef<E>>;

/**
 * Returns a ref object for providing to a HTML element and a state variable that stores an attribute of that element
 */
export function useElementAttribute<E extends Element, K extends keyof Ref<E>>(
    _element: E, // need this so that types don't need to be explicitly stated
    attribute: K,
    initial: Ref<E>[K]
) {
    const ref = useRef<React.ElementRef<E>>(null);
    const [attr, setAttr] = useState(initial);

    // update attribute with the ref
    useEffect(() => {
        if (ref.current) {
            setAttr(ref.current[attribute]);
        }
    }, [ref]);

    return [ref, attr] as const;
}
