'use client';

import { As, Icon as ChakraIcon, createIcon } from '@chakra-ui/react';
import {
    FaBars,
    FaBookOpen,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaEdit,
    FaHome,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPlus,
    FaSearch,
    FaTasks,
    FaTimes,
    FaTrashAlt,
    FaUser,
} from 'react-icons/fa';

export type IconName =
    | 'calendar'
    | 'close'
    | 'courses'
    | 'dashboard'
    | 'edit'
    | 'hamburger'
    | 'info'
    | 'left'
    | 'location'
    | 'logo'
    | 'plus'
    | 'right'
    | 'search'
    | 'tasks'
    | 'trash'
    | 'user';

function nameToIcon(icon: IconName): As {
    switch (icon) {
        case 'calendar':
            return FaCalendarAlt;
        case 'close':
            return FaTimes;
        case 'courses':
            return FaBookOpen;
        case 'dashboard':
            return FaHome;
        case 'edit':
            return FaEdit;
        case 'hamburger':
            return FaBars;
        case 'info':
            return FaInfoCircle;
        case 'left':
            return FaChevronLeft;
        case 'location':
            return FaMapMarkerAlt;
        case 'plus':
            return FaPlus;
        case 'right':
            return FaChevronRight;
        case 'search':
            return FaSearch;
        case 'tasks':
            return FaTasks;
        case 'trash':
            return FaTrashAlt;
        case 'user':
            return FaUser;
        case 'logo':
            return LogoIcon;
        default:
            const _: never = icon;
            throw new Error(`${icon} not setup yet!`);
    }
}

type IconProps = Parameters<typeof ChakraIcon>['0'] & {
    icon: IconName;
    variant?: string;
};

export function Icon(props: IconProps) {
    return <ChakraIcon {...props} as={nameToIcon(props.icon)} />;
}

const LogoIcon = createIcon({
    viewBox: '0 0 118 118',
    defaultProps: {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '10',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    },
    path: (
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
    ),
});
