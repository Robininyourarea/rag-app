'use client'

import { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDocumentContext } from '@/providers/DocumentContext';
import PdfPreview from '@/components/section/PdfPreview';
import Chat from '@/components/section/Chat';
import { UploadedDocument } from '@/types';

function EmptyState({ onUpload }: { onUpload: (doc: UploadedDocument) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const doc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    };
    onUpload(doc);
    e.target.value = '';
  };

  return (
    <Box
      sx={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2.5,
        bgcolor: '#f8fafc',
      }}
    >
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Upload icon */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: '#dbeafe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UploadFileIcon sx={{ fontSize: 32, color: '#2B6CB0' }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: '#2d3748', fontSize: 20 }}>
        Add a source to get started
      </Typography>

      <Button
        variant="outlined"
        onClick={() => fileInputRef.current?.click()}
        sx={{
          borderRadius: '999px',
          px: 4,
          py: 1,
          borderColor: '#cbd5e0',
          color: '#2d3748',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: 14,
          '&:hover': { borderColor: '#2B6CB0', color: '#2B6CB0', bgcolor: '#eff6ff' },
        }}
      >
        Upload a PDF
      </Button>

      {/* Disabled chat bar hint */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          height: 52,
          borderRadius: '12px',
          border: '1.5px solid #e2e8f0',
          bgcolor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ color: '#a0aec0' }}>
          Upload a source to get started
        </Typography>
        <Typography variant="caption" sx={{ color: '#cbd5e0' }}>
          0 sources
        </Typography>
      </Box>
    </Box>
  );
}

export default function Page() {
  const { uploadedDocs, selectedDoc, selectedSessionId, handleUpload, handleClosePreview } = useDocumentContext();

  const hasDocuments = uploadedDocs.length > 0;

  if (!hasDocuments) {
    return <EmptyState onUpload={handleUpload} />;
  }

  return (
    <>
      {/* PDF Preview panel — shown when a document is selected */}
      {selectedDoc && (
        <Box sx={{ width: '50%', flexShrink: 0, overflow: 'hidden' }}>
          <PdfPreview document={selectedDoc} onClose={handleClosePreview} />
        </Box>
      )}

      {/* Chat panel */}
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Chat
          sessionId={selectedSessionId}
          documentId={selectedDoc?.id}
        />
      </Box>
    </>
  );
}