'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Tooltip,
    IconButton,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChatSession } from '@/types';

export default function ChatHistory({ clearDocuments }: { clearDocuments: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);

    // Extract current sessionId from URL path: /chat/[sessionId]
    const currentSessionId = pathname.startsWith('/chat/') ? pathname.split('/')[2] : undefined;

    const refreshSessions = () => {
        setLoading(true);
        fetch('/api/sessions')
            .then(res => res.ok ? res.json() : [])
            .then(setSessions)
            .catch(() => setSessions([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refreshSessions();
    }, []);

    const hasHistory = sessions.length > 0;

    const handleSelect = (sessionId: string) => {
        clearDocuments();
        router.push(`/chat/${sessionId}`);
    };

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
            {/* Section header */}
            <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Chat History
                </Typography>
                <Tooltip title="Refresh">
                    <IconButton
                        size="small"
                        onClick={refreshSessions}
                        disabled={loading}
                        sx={{
                            color: 'text.disabled',
                            p: 0.3,
                            '&:hover': { color: 'primary.main' },
                        }}
                    >
                        <RefreshIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                </Box>
            ) : !hasHistory ? (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: 13 }}>
                        chat history is empty
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <List dense disablePadding>
                        {sessions.map((s) => (
                            <ListItem key={s.session_id} disablePadding>
                                <ListItemButton
                                    onClick={() => handleSelect(s.session_id)}
                                    selected={currentSessionId === s.session_id}
                                    sx={{
                                        borderRadius: '8px',
                                        mx: 0.5,
                                        px: 1.5,
                                        py: 0.8,
                                        '&.Mui-selected': {
                                            bgcolor: 'custom.surfaceSelected',
                                            '&:hover': { bgcolor: 'custom.surfaceSelected' },
                                        },
                                        '&:hover': { bgcolor: 'custom.surfaceHover' },
                                    }}
                                >
                                    <ChatBubbleOutlineIcon sx={{ fontSize: 15, color: 'text.secondary', mr: 1.2, flexShrink: 0 }} />
                                    <ListItemText
                                        primary={s.preview}
                                        slotProps={{
                                            primary: {
                                                variant: 'body2',
                                                sx: {
                                                    color: 'text.primary',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: 13,
                                                },
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
}