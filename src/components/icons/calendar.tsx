import { DEFAULT_STROKE_WIDTH, SVGComponent, color } from './props';

export const Calendar: SVGComponent = (props) => {
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
            <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
            <line x1='16' y1='2' x2='16' y2='6'></line>
            <line x1='8' y1='2' x2='8' y2='6'></line>
            <line x1='3' y1='10' x2='21' y2='10'></line>
        </svg>
    );
};
