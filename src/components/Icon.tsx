'use client';

import { As, Icon as ChakraIcon, createIcon } from '@chakra-ui/react';
import {
    AiOutlineBook,
    AiOutlineCalendar,
    AiOutlineClose,
    AiOutlineDelete,
    AiOutlineForm,
    AiOutlineHome,
    AiOutlineInfoCircle,
    AiOutlineLeft,
    AiOutlineMenu,
    AiOutlinePlus,
    AiOutlineRight,
    AiOutlineSearch,
    AiOutlineUser,
} from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi';
import { GoTasklist } from 'react-icons/go';

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
            return AiOutlineCalendar;
        case 'close':
            return AiOutlineClose;
        case 'courses':
            return AiOutlineBook;
        case 'dashboard':
            return AiOutlineHome;
        case 'edit':
            return AiOutlineForm;
        case 'hamburger':
            return AiOutlineMenu;
        case 'info':
            return AiOutlineInfoCircle;
        case 'left':
            return AiOutlineLeft;
        case 'location':
            return FiMapPin;
        case 'plus':
            return AiOutlinePlus;
        case 'right':
            return AiOutlineRight;
        case 'search':
            return AiOutlineSearch;
        case 'tasks':
            return GoTasklist;
        case 'trash':
            return AiOutlineDelete;
        case 'user':
            return AiOutlineUser;
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
