'use client'

import { createContext, useContext, useState, useCallback } from 'react';
import { UploadedDocument, ChatSession } from '@/types';

interface DocumentContextValue {
    uploadedDocs: UploadedDocument[];
    selectedDoc: UploadedDocument | null;
    selectedSessionId: string | undefined;
    handleUpload: (doc: UploadedDocument) => void;
    handleSelectDoc: (doc: UploadedDocument) => void;
    handleClosePreview: () => void;
    handleSelectSession: (sessionId: string, title: string) => void;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

export function useDocumentContext() {
    const ctx = useContext(DocumentContext);
    if (!ctx) throw new Error('useDocumentContext must be used inside DocumentProvider');
    return ctx;
}

export function DocumentProvider({ children }: { children: React.ReactNode }) {
    const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<UploadedDocument | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>(undefined);

    const handleUpload = useCallback((doc: UploadedDocument) => {
        setUploadedDocs(prev => [...prev, doc]);
        setSelectedDoc(doc);
    }, []);

    const handleSelectDoc = useCallback((doc: UploadedDocument) => {
        setSelectedDoc(prev => (prev?.id === doc.id ? null : doc));
    }, []);

    const handleClosePreview = useCallback(() => {
        setSelectedDoc(null);
    }, []);

    const handleSelectSession = useCallback((sessionId: string) => {
        setSelectedSessionId(sessionId);
    }, []);

    return (
        <DocumentContext.Provider
            value={{
                uploadedDocs,
                selectedDoc,
                selectedSessionId,
                handleUpload,
                handleSelectDoc,
                handleClosePreview,
                handleSelectSession,
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
}
