'use client'

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '@/styles/theme';

export default function MuiThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}   