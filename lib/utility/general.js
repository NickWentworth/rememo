export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function plural(count) {
    return (count != 1) ? 's' : '';
}
