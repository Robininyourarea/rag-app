import { createTheme } from '@mui/material/styles';

// Add custom palette color
declare module '@mui/material/styles' {
    interface Palette {
        custom: {
            main: string;
        };
    }

    interface PaletteOptions {
        custom?: {
            main?: string;
        };
    }
}

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2B6CB0',
        },
        secondary: {
            main: '#718096',
        },
        background: {
            default: '#ffffff',
            paper: '#f8fafc',
        },
        custom: {
            main: '#2B6CB0',
        },
    },
    typography: {
        fontFamily: 'var(--font-poppins), "Inter", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#ffffff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    },
});