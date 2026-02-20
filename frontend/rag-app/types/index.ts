export interface UploadedDocument {
    id: string;
    name: string;
    url: string; // object URL for local preview
    uploadedAt: Date;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
    updatedAt?: string;
}
