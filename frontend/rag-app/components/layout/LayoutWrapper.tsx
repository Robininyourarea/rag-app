'use client'

import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { DocumentProvider, useDocumentContext } from '@/providers/DocumentContext';

interface LayoutWrapperProps {
    children: React.ReactNode;
}

// Inner component that consumes context (so it re-renders when context changes)
function LayoutInner({ children }: { children: React.ReactNode }) {
    const {
        uploadedDocs,
        selectedDoc,
        selectedSessionId,
        handleUpload,
        handleSelectDoc,
        handleSelectSession,
    } = useDocumentContext();

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#ffffff', overflow: 'hidden' }}>
            {/* Sidebar */}
            <Sidebar
                uploadedDocs={uploadedDocs}
                selectedDocId={selectedDoc?.id}
                selectedSessionId={selectedSessionId}
                onUpload={handleUpload}
                onSelectDoc={handleSelectDoc}
                onSelectSession={handleSelectSession}
            />

            {/* Main content — provided by the page as children */}
            <Box component="main" sx={{ flex: 1, display: 'flex', overflow: 'hidden', bgcolor: '#ffffff' }}>
                {children}
            </Box>
        </Box>
    );
}

export default function LayoutWrapper({ children }: Readonly<LayoutWrapperProps>) {
    return (
        <DocumentProvider>
            <LayoutInner>{children}</LayoutInner>
        </DocumentProvider>
    );
}