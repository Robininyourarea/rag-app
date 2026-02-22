'use client'

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentContext } from '@/providers/DocumentContext';
import { UploadedDocument } from '@/types';

interface UseFileUploadOptions {
    /** Current session ID — if provided, the file is appended to this session */
    sessionId?: string;
    /** Called when a new session is created (so the caller can track it) */
    onSessionCreated?: (sessionId: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
    const { sessionId, onSessionCreated } = options;
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { handleUpload } = useDocumentContext();

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploading(true);
            try {
                const newSessionId = sessionId ?? crypto.randomUUID();

                const formData = new FormData();
                formData.append('file', file);
                formData.append('session_id', newSessionId);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!uploadRes.ok) throw new Error('Upload failed');

                const res = await uploadRes.json();
                const finalSessionId = res.session_id || newSessionId;

                const doc: UploadedDocument = {
                    id: crypto.randomUUID(),
                    name: file.name,
                    url: URL.createObjectURL(file),
                    uploadedAt: new Date(),
                };
                handleUpload(doc);

                // If there was no session yet, navigate to the new one
                if (!sessionId) {
                    router.push(`/chat/${finalSessionId}`);
                }

                onSessionCreated?.(finalSessionId);
            } catch (err) {
                console.error('Upload failed:', err);
            } finally {
                setUploading(false);
                e.target.value = '';
            }
        },
        [sessionId, handleUpload, router, onSessionCreated],
    );

    return { uploading, fileInputRef, openFilePicker, handleFileChange };
}
