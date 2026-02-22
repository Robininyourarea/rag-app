'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        p: 4,
                        bgcolor: 'background.default',
                        color: 'text.primary',
                    }}
                >
                    <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Something went wrong
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 400 }}
                    >
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={this.handleReset}
                        sx={{
                            mt: 1,
                            borderRadius: '999px',
                            textTransform: 'none',
                            borderColor: 'divider',
                            color: 'text.primary',
                            '&:hover': {
                                borderColor: 'primary.main',
                                color: 'primary.main',
                            },
                        }}
                    >
                        Try again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}
