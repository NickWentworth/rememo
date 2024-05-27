import {
    createMultiStyleConfigHelpers,
    defineStyleConfig,
    extendTheme,
} from '@chakra-ui/react';

export const theme = extendTheme({
    colors: {
        bg: {
            // https://smart-swatch.netlify.app/#2a302f
            50: '#eaf5f5',
            100: '#d6dbda',
            200: '#bec2c2',
            300: '#a4abaa',
            400: '#8b9291',
            500: '#717977',
            600: '#575e5d',
            700: '#3f4343',
            750: '#323636', // added
            800: '#242928',
            900: '#06100b',
        },
        accent: {
            // https://smart-swatch.netlify.app/#27c69b
            50: '#defef5',
            100: '#b8f3e5',
            200: '#90ebd3',
            300: '#67e2c1',
            400: '#3fd9b0',
            500: '#26c096',
            600: '#189575',
            700: '#0b6b52',
            800: '#004131',
            900: '#001710',
        },
    },
    zIndices: {
        sidebar: 1, // sidebar should display shadow over neighboring content
    },
    components: {
        Text: defineStyleConfig({
            baseStyle: {
                fontFamily: '"Inter", sans-serif',
            },
            variants: {
                h1: { fontSize: '20px', fontWeight: '500', color: 'bg.50' },
                h2: { fontSize: '20px', fontWeight: '400', color: 'bg.50' },
                h3: { fontSize: '16px', fontWeight: '400', color: 'bg.50' },
                h4: { fontSize: '16px', fontWeight: '300', color: 'bg.200' },
                p: { fontSize: '14px', fontWeight: '300', color: 'bg.200' },
                logo: {
                    fontFamily: '"Quicksand", sans-serif',
                    fontSize: '36px',
                    fontWeight: '600',
                    color: 'accent.500',
                },
            },
            defaultProps: {
                variant: 'p',
            },
        }),

        Icon: defineStyleConfig({
            variants: {
                white: { color: 'bg.50' },
                light: { color: 'bg.200' },
                dark: { color: 'bg.800' },
                accent: { color: 'accent.500' },
            },
        }),

        // default divider styling
        Divider: defineStyleConfig({
            baseStyle: {
                borderColor: 'bg.400',
                opacity: '25%',
            },
        }),

        // remove card shadow effect
        Card: createMultiStyleConfigHelpers([
            'container',
        ]).defineMultiStyleConfig({
            baseStyle: {
                container: {
                    bg: 'bg.800',
                    shadow: 'none',
                },
            },
        }),

        Modal: createMultiStyleConfigHelpers(['dialog']).defineMultiStyleConfig(
            {
                baseStyle: { dialog: { bg: 'bg.800' } },
            }
        ),

        // make input be a bit smaller by default
        Input: createMultiStyleConfigHelpers(['field']).defineMultiStyleConfig({
            baseStyle: { field: { pr: '0.5rem' } },
            defaultProps: { size: 'sm', variant: 'filled' },
        }),
        Select: defineStyleConfig({
            defaultProps: { size: 'sm', variant: 'filled' },
        }),
        Textarea: defineStyleConfig({
            defaultProps: { size: 'sm', variant: 'filled' },
        }),
        FormLabel: defineStyleConfig({
            baseStyle: {
                fontWeight: '400',
                mb: '0.25rem',
            },
        }),

        // include larger radio size
        Radio: createMultiStyleConfigHelpers([
            'control',
        ]).defineMultiStyleConfig({
            sizes: {
                xl: {
                    control: {
                        w: '7',
                        h: '7',
                    },
                },
            },
        }),
    },
});
