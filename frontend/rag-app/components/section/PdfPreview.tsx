'use client'

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Typography, IconButton, CircularProgress, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { UploadedDocument } from '@/types';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use local worker bundled with react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PdfPreviewProps {
    document: UploadedDocument;
    onClose: () => void;
}

export default function PdfPreview({ document, onClose }: PdfPreviewProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [loading, setLoading] = useState(true);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setLoading(false);
    }, []);

    const onDocumentLoadError = useCallback(() => {
        setLoading(false);
    }, []);

    const goToPrev = () => setPageNumber(p => Math.max(1, p - 1));
    const goToNext = () => setPageNumber(p => Math.min(numPages, p + 1));
    const zoomIn = () => setScale(s => Math.min(2.5, parseFloat((s + 0.2).toFixed(1))));
    const zoomOut = () => setScale(s => Math.max(0.5, parseFloat((s - 0.2).toFixed(1))));

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.5,
                    gap: 1,
                    bgcolor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <PictureAsPdfIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                <Typography
                    variant="body2"
                    sx={{
                        flex: 1,
                        fontWeight: 600,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: 13,
                    }}
                >
                    {document.name}
                </Typography>

                {/* Zoom controls */}
                <Tooltip title="Zoom out">
                    <IconButton size="small" onClick={zoomOut} disabled={scale <= 0.5} sx={{ color: 'text.secondary' }}>
                        <ZoomOutIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 38, textAlign: 'center' }}>
                    {Math.round(scale * 100)}%
                </Typography>
                <Tooltip title="Zoom in">
                    <IconButton size="small" onClick={zoomIn} disabled={scale >= 2.5} sx={{ color: 'text.secondary' }}>
                        <ZoomInIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                {/* Close */}
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ color: 'text.disabled', ml: 1, '&:hover': { color: 'text.secondary' } }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* PDF content */}
            <Box
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2,
                    px: 1,
                    gap: 2,
                }}
            >
                {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <CircularProgress size={32} sx={{ color: 'primary.main' }} />
                    </Box>
                )}

                <Document
                    file={document.url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        loading={null}
                    />
                </Document>
            </Box>

            {/* Pagination footer */}
            {numPages > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        bgcolor: 'background.default',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0,
                    }}
                >
                    <IconButton size="small" onClick={goToPrev} disabled={pageNumber <= 1} sx={{ color: 'text.secondary' }}>
                        <NavigateBeforeIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                        {pageNumber} / {numPages}
                    </Typography>
                    <IconButton size="small" onClick={goToNext} disabled={pageNumber >= numPages} sx={{ color: 'text.secondary' }}>
                        <NavigateNextIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}
