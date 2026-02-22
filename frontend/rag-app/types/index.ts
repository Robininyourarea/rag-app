export interface UploadedDocument {
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    session_id: string;
    created_at: string;
    updated_at: string;
    preview: string;
    message_count: number;
}
