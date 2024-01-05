/**
 * Searches a list of strings for a given term, returning `true` if any contain the term
 *
 * Searches ignore case
 */
export function search(term: string, strings: string[]): boolean {
    // convert strings to lowercase to ignore case
    const termFmt = term.toLowerCase();
    const stringsFmt = strings.map((s) => s.toLowerCase());

    // search strings
    return stringsFmt.some((s) => s.includes(termFmt));
}
