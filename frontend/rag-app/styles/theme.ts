import { createTheme } from '@mui/material/styles';

// Extend palette with custom tokens
declare module '@mui/material/styles' {
    interface Palette {
        custom: {
            button: string;
            sidebar: string;
            userBubble: string;
            surfaceHover: string;
            surfaceSelected: string;
            inputBg: string;
            subtleText: string;
        };
    }

    interface PaletteOptions {
        custom?: {
            button?: string;
            sidebar?: string;
            userBubble?: string;
            surfaceHover?: string;
            surfaceSelected?: string;
            inputBg?: string;
            subtleText?: string;
        };
    }
}

// Pure achromatic dark — no color, only grays
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C4C7CC',     // Light gray (used for buttons/accents)
            dark: '#2C2D30',     // Dark gray (button hover)
            light: '#E3E5E8',
        },
        secondary: {
            main: '#8A8D93',
        },
        background: {
            default: '#1F2023',  // Main canvas — dark charcoal
            paper: '#2A2B2E',    // Panels, cards — slightly lighter
        },
        text: {
            primary: '#E3E5E8',   // Near-white
            secondary: '#9AA0A6', // Mid-gray
            disabled: '#5F6368',  // Muted gray
        },
        divider: '#3C3D40',
        error: {
            main: '#F28B82',
        },
        custom: {
            button: '#e46a18ff',
            sidebar: '#17181B',       // Darkest — sidebar bg
            userBubble: '#3C3D40',    // User message bubble — subtle gray
            surfaceHover: '#302e2cff',  // Hover state
            surfaceSelected: '#28292cff', // Selected state
            inputBg: '#2A2B2E',       // Input bg = paper
            subtleText: '#5F6368',    // Placeholder / disabled text
        },
    },
    typography: {
        fontFamily: 'var(--font-poppins), "Inter", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#1F2023',
                    scrollbarColor: '#3C3D40 #17181B',
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-track': { background: '#17181B' },
                    '&::-webkit-scrollbar-thumb': { background: '#3C3D40', borderRadius: 3 },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#3C3D40',
                },
            },
        },
    },
});