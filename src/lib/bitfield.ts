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
 * Converts a list of indices into a bitfield with 1-bits at the indices
 *
 * @example
 * dayListToBitfield([1,2,5]) => ...0010_0110
 */
export function listToBitfield(list: number[]): number {
    return list.reduce((bitfield, idx) => setBitAt(bitfield, idx, true));
}

/**
 * Set the bit at the given index to 1 (true) or 0 (false)
 */
export function setBitAt(bitfield: number, at: number, to: boolean): number {
    if (to) {
        // set bit to true
        return bitfield | (1 << at);
    } else {
        // set bit to false
        return bitfield & ~(1 << at);
    }
}

/**
 * Toggle the bit at the given index
 */
export function toggleBitAt(bitfield: number, at: number): number {
    return bitfield ^ (1 << at);
}

/**
 * Returns the bit at the given index as a boolean
 */
export function getBitAt(bitfield: number, at: number): boolean {
    return !!(bitfield & (1 << at));
}
