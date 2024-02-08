type ClassValue = string | boolean | undefined;

/**
 * Builds a class string for use in JSX elements
 *
 * Accepts the following:
 * - `string` class names, ex: `styles.container`
 * - `<bool> && <bool> && ... && <class_name>`, ex: `props.isSquare && styles.square`
 */
export function buildClass(...classes: ClassValue[]): string {
    return classes.filter((c) => c !== false ?? false).join(' ');
}

/**
 * Returns a range of integers from a (inclusive) to b (exclusive)
 *
 * @example
 * range(0, 5) => [0, 1, 2, 3, 4]
 * range(1, 4) => [1, 2, 3]
 */
export function range(a: number, b: number) {
    return Array.from({ length: b - a }, (_, key) => key + a);
}

/**
 * Linearly interpolates a given value `t` ranging from 0-1 into a range from `a` to `b`
 */
export function lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
}

/**
 * Inversely interpolates a given value `v` ranging from `a` to `b` into a range from 0-1
 */
export function inverseLerp(a: number, b: number, v: number) {
    return (v - a) / (b - a);
}

/**
 * Maps a given `from` value, which ranges from `fromMin` to `fromMax`, into a range from `toMin` to `toMax`
 */
export function remap(
    from: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
) {
    const t = inverseLerp(fromMin, fromMax, from);
    return lerp(toMin, toMax, t);
}
