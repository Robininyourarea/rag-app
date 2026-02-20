import { ChatSession, ChatMessage } from '@/types';

const AI_SERVER_BASE = process.env.NEXT_PUBLIC_AI_SERVER_URL || 'http://localhost:8000';

// Upload a PDF file to the AI server
export async function uploadPdfFile(file: File): Promise<{ document_id: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${AI_SERVER_BASE}/api/documents`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
    }
    return res.json();
}

// Fetch all chat sessions (history) from the AI server
export async function fetchChatHistory(): Promise<ChatSession[]> {
    const res = await fetch(`${AI_SERVER_BASE}/api/chat/history`);
    if (!res.ok) {
        throw new Error(`Failed to fetch history: ${res.statusText}`);
    }
    return res.json();
}

// Send a chat message
export async function sendChatMessage(
    message: string,
    sessionId?: string,
    documentId?: string
): Promise<{ session_id: string; reply: string }> {
    const res = await fetch(`${AI_SERVER_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId, document_id: documentId }),
    });

    if (!res.ok) {
        throw new Error(`Chat failed: ${res.statusText}`);
    }
    return res.json();
}

// Fetch messages for a specific session
export async function fetchSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const res = await fetch(`${AI_SERVER_BASE}/api/chat/${sessionId}/messages`);
    if (!res.ok) {
        throw new Error(`Failed to fetch messages: ${res.statusText}`);
    }
    return res.json();
}
