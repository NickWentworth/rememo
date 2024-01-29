import { DEFAULT_STROKE_WIDTH, SVGComponent, color } from './props';

export const Info: SVGComponent = (props) => {
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
            <circle cx='12' cy='12' r='10'></circle>
            <line x1='12' y1='16' x2='12' y2='12'></line>
            <line x1='12' y1='8' x2='12.01' y2='8'></line>
        </svg>
    );
};
