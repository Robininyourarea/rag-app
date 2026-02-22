'use client'

import { useRouter } from 'next/navigation';
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
import ChatHistory from '@/components/features/ChatHistory';

interface SidebarProps {
    uploadedDocs: UploadedDocument[];
    selectedDocId?: string;
    onSelectDoc: (doc: UploadedDocument) => void;
    clearDocuments: () => void;
}

export default function Sidebar({
    uploadedDocs,
    selectedDocId,
    onSelectDoc,
    clearDocuments,
}: Readonly<SidebarProps>) {
    const router = useRouter();

    const handleNewChat = () => {
        clearDocuments();
        router.push('/');
    };

    return (
        <Box
            sx={{
                width: 260,
                flexShrink: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'custom.sidebar',
                borderRight: '1px solid',
                borderColor: 'divider',
                overflowY: 'hidden',
            }}
        >

            {/* Logo / App name */}
            <Box sx={{ px: 2.5, py: 1.32, flexShrink: 0 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        fontSize: 20,
                        letterSpacing: -0.5,
                        cursor: 'pointer',
                    }}
                    onClick={() => router.push('/')}
                >
                    Delph.ai
                </Typography>
            </Box>
            <Divider />

            {/* New Chat button */}
            <Box sx={{ px: 2, pb: 1.5, pt: 1.5, flexShrink: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewChat}
                    sx={{
                        bgcolor: 'custom.button',
                        color: 'text.primary',
                        borderRadius: '50px',
                        py: 1,
                        fontWeight: 500,
                        fontSize: 14,
                        textTransform: 'none',
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            bgcolor: 'custom.surfaceHover',
                            borderColor: 'text.disabled',
                            boxShadow: 'none',
                        },
                    }}
                >
                    New Chat
                </Button>
            </Box>

            {/* Uploaded documents */}
            {uploadedDocs.length > 0 && (
                <>
                    <Box sx={{ px: 2, py: 1, flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
                                            '&.Mui-selected': {
                                                bgcolor: 'custom.surfaceSelected',
                                                '&:hover': { bgcolor: 'custom.surfaceSelected' },
                                            },
                                            '&:hover': { bgcolor: 'custom.surfaceHover' },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <PictureAsPdfIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={doc.name}
                                            slotProps={{
                                                primary: {
                                                    variant: 'body2',
                                                    sx: {
                                                        fontSize: 13,
                                                        fontWeight: selectedDocId === doc.id ? 600 : 400,
                                                        color: 'text.primary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    },
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
            <ChatHistory clearDocuments={clearDocuments} />
        </Box>
    );
}