export const STROKE_WIDTH = 2;

type SVGProps = {
    color: 'dark' | 'medium' | 'light' | 'white' | 'accent';
    size: number;
};

export interface SVGComponent {
    (props: SVGProps): React.JSX.Element;
}

export function color(props: SVGProps): string {
    return `var(--${props.color})`;
}
