'use client'

import { useRef } from 'react';
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { UploadedDocument } from '@/types';
import ChatHistory from '@/components/section/ChatHistory';

interface SidebarProps {
    uploadedDocs: UploadedDocument[];
    selectedDocId?: string;
    selectedSessionId?: string;
    onUpload: (doc: UploadedDocument) => void;
    onSelectDoc: (doc: UploadedDocument) => void;
    onSelectSession: (sessionId: string, title: string) => void;
}

export default function Sidebar({
    uploadedDocs,
    selectedDocId,
    selectedSessionId,
    onUpload,
    onSelectDoc,
    onSelectSession,
}: Readonly<SidebarProps>) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNewDocument = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const doc: UploadedDocument = {
            id: `doc-${Date.now()}`,
            name: file.name,
            url: URL.createObjectURL(file),
            uploadedAt: new Date(),
        };
        onUpload(doc);

        // Reset so same file can be selected again
        e.target.value = '';
    };

    return (
        <Box
            sx={{
                width: 260,
                flexShrink: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#ffffff',
                borderRight: '1px solid #e2e8f0',
                overflowY: 'hidden',
            }}
        >
            {/* Hidden file input */}
            <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            {/* Logo / App name */}
            <Box sx={{ px: 2.5, py: 2.5, flexShrink: 0 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: '#2B6CB0',
                        fontSize: 20,
                        letterSpacing: -0.5,
                    }}
                >
                    ChatPDF
                </Typography>
            </Box>

            {/* New Document button */}
            <Box sx={{ px: 2, pb: 1.5, flexShrink: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewDocument}
                    sx={{
                        bgcolor: '#2B6CB0',
                        color: '#ffffff',
                        borderRadius: '10px',
                        py: 1,
                        fontWeight: 600,
                        fontSize: 14,
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(43,108,176,0.25)',
                        '&:hover': {
                            bgcolor: '#1e4e8c',
                            boxShadow: '0 4px 12px rgba(43,108,176,0.35)',
                        },
                    }}
                >
                    New Document
                </Button>
            </Box>

            {/* Uploaded documents */}
            {uploadedDocs.length > 0 && (
                <>
                    <Box sx={{ px: 2.5, pb: 0.5, flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ color: '#a0aec0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Documents
                        </Typography>
                    </Box>
                    <List dense disablePadding sx={{ flexShrink: 0 }}>
                        {uploadedDocs.map((doc) => (
                            <ListItem key={doc.id} disablePadding>
                                <Tooltip title={doc.name} placement="right" enterDelay={800}>
                                    <ListItemButton
                                        selected={selectedDocId === doc.id}
                                        onClick={() => onSelectDoc(doc)}
                                        sx={{
                                            borderRadius: '10px',
                                            mx: 1,
                                            px: 1.5,
                                            py: 0.8,
                                            '&.Mui-selected': { bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } },
                                            '&:hover': { bgcolor: '#f0f4ff' },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <PictureAsPdfIcon sx={{ fontSize: 18, color: '#e53e3e' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={doc.name}
                                            primaryTypographyProps={{
                                                variant: 'body2',
                                                sx: {
                                                    fontSize: 13,
                                                    fontWeight: selectedDocId === doc.id ? 600 : 400,
                                                    color: '#2d3748',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ mx: 2, my: 1.5 }} />
                </>
            )}

            {/* Chat History */}
            <ChatHistory onSelectSession={onSelectSession} selectedSessionId={selectedSessionId} />
        </Box>
    );
}