import { DEFAULT_STROKE_WIDTH, SVGComponent, color } from './props';

export const Dashboard: SVGComponent = (props) => {
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
            <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
            <polyline points='9 22 9 12 15 12 15 22'></polyline>
        </svg>
    );
};
