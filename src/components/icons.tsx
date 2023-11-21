export type Icon = 'test';

type SVGProps = {
    icon: Icon;
    color: 'dark' | 'medium' | 'light' | 'white' | 'accent';
    size: number;
};

export function SVG(props: SVGProps) {
    const size = props.size.toString();

    switch (props.icon) {
        case 'test':
            return (
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={size}
                    height={size}
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke={`var(--${props.color})`}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'></path>
                    <polyline points='3.27 6.96 12 12.01 20.73 6.96'></polyline>
                    <line x1='12' y1='22.08' x2='12' y2='12'></line>
                </svg>
            );
    }
}
