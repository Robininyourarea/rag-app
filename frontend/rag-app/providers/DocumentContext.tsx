'use client'

import { createContext, useContext, useState, useCallback } from 'react';
import { UploadedDocument } from '@/types';

interface DocumentContextValue {
    uploadedDocs: UploadedDocument[];
    selectedDoc: UploadedDocument | null;
    handleUpload: (doc: UploadedDocument) => void;
    handleSelectDoc: (doc: UploadedDocument) => void;
    handleClosePreview: () => void;
    clearDocuments: () => void;
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

    const clearDocuments = useCallback(() => {
        setUploadedDocs([]);
        setSelectedDoc(null);
    }, []);

    return (
        <DocumentContext.Provider
            value={{
                uploadedDocs,
                selectedDoc,
                handleUpload,
                handleSelectDoc,
                handleClosePreview,
                clearDocuments,
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
}
