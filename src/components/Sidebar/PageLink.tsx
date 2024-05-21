import { SVGComponent } from '../icons/props';
import { SIDEBAR_ICON_SIZE } from './Sidebar';
import { usePathname } from 'next/navigation';
import { Link } from '@chakra-ui/next-js';
import { Flex, IconButton, Text } from '@chakra-ui/react';

type PageLinkProps = {
    // display name of link
    name: string;
    // routing location of link
    to: string;
    // icon to display
    icon: SVGComponent;
    // is the sidebar expanded?
    expanded: boolean;
};

export function PageLink(props: PageLinkProps) {
    // is this page link the active one?
    const active = usePathname() === props.to;

    return (
        <Link href={props.to}>
            <IconButton
                size='lg'
                variant='ghost'
                w='100%'
                justifyContent='start'
                px='0.5rem'
                icon={
                    <Flex align='center' gap='0.5rem'>
                        <props.icon
                            color={active ? 'accent' : 'white'}
                            size={SIDEBAR_ICON_SIZE}
                        />

                        {props.expanded && (
                            <Text
                                variant='h1'
                                color={active ? 'accent.500' : undefined}
                            >
                                {props.name}
                            </Text>
                        )}
                    </Flex>
                }
                aria-label={props.name}
            />
        </Link>
    );
}
