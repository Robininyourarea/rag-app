'use client'

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { fetchChatHistory } from '@/lib/api';
import { ChatSession } from '@/types';

interface ChatHistoryProps {
    onSelectSession?: (sessionId: string, title: string) => void;
    selectedSessionId?: string;
}

function groupSessions(sessions: ChatSession[]) {
    const now = new Date();
    const today: ChatSession[] = [];
    const prev7: ChatSession[] = [];
    const prev30: ChatSession[] = [];
    const older: ChatSession[] = [];

    sessions.forEach((s) => {
        const created = new Date(s.createdAt);
        const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 1) today.push(s);
        else if (diffDays < 7) prev7.push(s);
        else if (diffDays < 30) prev30.push(s);
        else older.push(s);
    });

    return { today, prev7, prev30, older };
}

function SessionGroup({
    label,
    sessions,
    onSelect,
    selectedId,
}: {
    label: string;
    sessions: ChatSession[];
    onSelect: (id: string, title: string) => void;
    selectedId?: string;
}) {
    if (sessions.length === 0) return null;
    return (
        <Box>
            <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontWeight: 600, px: 1.5, py: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
                {label}
            </Typography>
            <List dense disablePadding>
                {sessions.map((s) => (
                    <ListItem key={s.id} disablePadding>
                        <Tooltip title={s.title} placement="right" enterDelay={800}>
                            <ListItemButton
                                onClick={() => onSelect(s.id, s.title)}
                                selected={selectedId === s.id}
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
                                    primary={s.title}
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
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default function ChatHistory({ onSelectSession, selectedSessionId }: ChatHistoryProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChatHistory()
            .then(setSessions)
            .catch(() => {
                // If server not reachable, show empty state gracefully
                setSessions([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const { today, prev7, prev30, older } = groupSessions(sessions);
    const hasHistory = today.length + prev7.length + prev30.length + older.length > 0;

    const handleSelect = (id: string, title: string) => {
        onSelectSession?.(id, title);
    };

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
            {/* Section header */}
            <Box sx={{ px: 2, py: 1 }}>
                {/* <HistoryIcon sx={{ fontSize: 16, color: 'text.disabled' }} /> */}
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Chat History
                </Typography>
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
                    <SessionGroup label="Today" sessions={today} onSelect={handleSelect} selectedId={selectedSessionId} />
                    <SessionGroup label="Previous 7 Days" sessions={prev7} onSelect={handleSelect} selectedId={selectedSessionId} />
                    <SessionGroup label="Previous 30 Days" sessions={prev30} onSelect={handleSelect} selectedId={selectedSessionId} />
                    <SessionGroup label="Older" sessions={older} onSelect={handleSelect} selectedId={selectedSessionId} />
                </Box>
            )}
        </Box>
    );
}