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
 * Converts a bitfield into a list of numbers where the 1-bits occurred
 *
 * @example
 * // 42 = ...0010_1010
 * bitfieldToList(42) => [1, 3, 5]
 */
export function bitfieldToList(bitfield: number): number[] {
    // convert to binary string and filter out the 0 bits
    return bitfield
        .toString(2)
        .split('')
        .reverse()
        .map((bit, idx) => [bit, idx] as const)
        .filter(([bit, _]) => bit === '1')
        .map(([_, idx]) => idx);
}

/**
 * Converts a frontend list of indices into a backend bitfield with 1-bits at the indices
 *
 * @example
 * dayListToBitfield([1,2,5]) => ...0010_0110
 */
export function listToBitfield(list: number[]): number {
    return list.reduce((bitfield, idx) => (1 << idx) | bitfield, 0);
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
