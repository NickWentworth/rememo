import { DEFAULT_STROKE_WIDTH, SVGComponent, color } from './props';

export const Close: SVGComponent = (props) => {
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
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
    );
};
