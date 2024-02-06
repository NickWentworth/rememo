import { DEFAULT_STROKE_WIDTH, SVGComponent, color } from './props';

export const Right: SVGComponent = (props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width={props.size}
            height={props.size}
            viewBox='0 0 24 24'
            fill='none'
            stroke={color(props)}
            strokeWidth={props.stroke ?? DEFAULT_STROKE_WIDTH}
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <polyline points='9 18 15 12 9 6'></polyline>
        </svg>
    );
};
