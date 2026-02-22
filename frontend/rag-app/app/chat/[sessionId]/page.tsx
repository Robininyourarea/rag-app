'use client'

import { use, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useDocumentContext } from '@/providers/DocumentContext';
import PdfPreview from '@/components/features/PdfPreview';
import Chat from '@/components/features/Chat';

interface ChatPageProps {
    params: Promise<{ sessionId: string }>;
}

export default function ChatBySessionPage({ params }: ChatPageProps) {
    const { sessionId } = use(params);
    const { selectedDoc, handleClosePreview } = useDocumentContext();

    // displayDoc lags behind selectedDoc so PdfPreview stays mounted during close animation
    const [displayDoc, setDisplayDoc] = useState(selectedDoc);
    const [showPdf, setShowPdf] = useState(!!selectedDoc);

    useEffect(() => {
        if (selectedDoc) {
            setDisplayDoc(selectedDoc);
            setShowPdf(true);
        } else {
            setShowPdf(false);
            const timer = setTimeout(() => setDisplayDoc(null), 320);
            return () => clearTimeout(timer);
        }
    }, [selectedDoc]);

    return (
        <>
            {/* PDF Preview panel — slides in/out with CSS width transition */}
            <Box
                sx={{
                    width: showPdf ? '50%' : '0%',
                    flexShrink: 0,
                    overflow: 'hidden',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {displayDoc && (
                    <PdfPreview document={displayDoc} onClose={handleClosePreview} />
                )}
            </Box>

            {/* Chat panel */}
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Chat sessionId={sessionId} />
            </Box>
        </>
    );
}
