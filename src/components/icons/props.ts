export const DEFAULT_STROKE_WIDTH = 2;

type SVGProps = {
    color: 'dark' | 'medium' | 'light' | 'white' | 'accent' | 'transparent';
    size: number;
    stroke?: number;
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
