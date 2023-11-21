import { STROKE_WIDTH, SVGComponent, color } from './props';

export const Logo: SVGComponent = (props) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width={props.size}
            height={props.size}
            viewBox='0 0 118 118'
            fill='none'
            stroke={color(props)}
            strokeWidth={STROKE_WIDTH * 5}
            strokeLinecap='round'
        >
            <g>
                <line x1='85' y1='113' x2='113' y2='113' />
                <line x1='113' y1='113' x2='113' y2='85' />
                <line x1='85' y1='113' x2='76.4436' y2='104.515' />
                <line x1='5' y1='33' x2='56' y2='84' />
                <line x1='113' y1='85' x2='83.2304' y2='55.3015' />
                <line x1='33' y1='5' x2='62' y2='34' />
                <line x1='35' y1='35' x2='86.6899' y2='86.6188' />
                <line x1='5' y1='33' x2='33' y2='5' />
                <line x1='21' y1='49' x2='49' y2='21' />
            </g>
        </svg>
    );
};
