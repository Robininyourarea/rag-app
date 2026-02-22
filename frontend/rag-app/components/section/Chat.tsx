'use client'

import { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Avatar, CircularProgress, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { sendChatMessage } from '@/lib/api';
import { ChatMessage } from '@/types';

interface ChatProps {
    sessionId?: string;
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function Chat({ sessionId }: ChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        setCurrentSessionId(sessionId);
    }, [sessionId]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: trimmed,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await sendChatMessage(trimmed, currentSessionId);
            if (res.session_id && !currentSessionId) {
                setCurrentSessionId(res.session_id);
            }
            const aiMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: res.answer,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
            const errMsg: ChatMessage = {
                id: `err-${Date.now()}`,
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.default',
            }}
        >
            {/* Messages */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    px: 3,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            display: 'flex',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            gap: 1.5,
                        }}
                    >
                        {/* Bubble */}
                        <Box sx={{ maxWidth: '70%' }}>
                            {msg.role === 'assistant' ? (
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            p: 1.5,
                                            bgcolor: 'transparent',
                                            color: 'text.primary',
                                            lineHeight: 1.7,
                                            whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {msg.content}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', pl: 1.5 }}>
                                        {formatTime(msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp))}
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            bgcolor: 'custom.userBubble',
                                            color: '#ffffff',
                                            borderRadius: '18px 18px 4px 18px',
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                            {msg.content}
                                        </Typography>
                                    </Paper>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', textAlign: 'right', pr: 1 }}>
                                        {formatTime(msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp))}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}

                {/* Loading indicator */}
                {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <SmartToyIcon sx={{ fontSize: 18 }} />
                        </Avatar> */}
                        <Box sx={{ display: 'flex', gap: 0.5, p: 1.5 }}>
                            {[0, 1, 2].map((i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'text.secondary',
                                        animation: 'bounce 1.2s infinite',
                                        animationDelay: `${i * 0.2}s`,
                                        '@keyframes bounce': {
                                            '0%, 80%, 100%': { transform: 'scale(0)' },
                                            '40%': { transform: 'scale(1)' },
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
                <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.default',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        border: '1.5px solid',
                        borderColor: 'divider',
                        borderRadius: '50px',
                        px: 2,
                        py: 0.5,
                        bgcolor: 'custom.inputBg',
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            bgcolor: 'background.paper',
                        },
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder="Ask me anything ..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        variant="standard"
                        slotProps={{ input: { disableUnderline: true } }}
                        sx={{
                            '& .MuiInputBase-root': { fontSize: 14, color: 'text.primary' },
                            '& .MuiInputBase-input::placeholder': { color: 'text.disabled', opacity: 1 },
                        }}
                    />
                    <IconButton
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        sx={{
                            bgcolor: input.trim() && !loading ? 'primary.main' : 'custom.surfaceHover',
                            color: input.trim() && !loading ? '#ffffff' : 'text.disabled',
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: input.trim() && !loading ? 'primary.dark' : 'custom.surfaceHover',
                            },
                        }}
                    >
                        {loading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <SendIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}