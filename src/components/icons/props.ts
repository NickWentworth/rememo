export const STROKE_WIDTH = 1;

type SVGProps = {
    color: 'dark' | 'medium' | 'light' | 'white' | 'accent' | 'transparent';
    size: number;
};

export interface SVGComponent {
    (props: SVGProps): React.JSX.Element;
}

export function color(props: SVGProps): string {
    switch (props.color) {
        case 'transparent':
            return 'transparent';
        default:
            return `var(--${props.color})`;
    }
}
