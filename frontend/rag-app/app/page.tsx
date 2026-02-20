'use client'

import { useRef, useState, useEffect } from 'react';
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
        bgcolor: 'background.default',
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
          bgcolor: 'custom.surfaceSelected',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UploadFileIcon sx={{ fontSize: 32, color: 'primary.main' }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: 20 }}>
        Add a source to get started
      </Typography>

      <Button
        variant="outlined"
        onClick={() => fileInputRef.current?.click()}
        sx={{
          borderRadius: '999px',
          px: 4,
          py: 1,
          borderColor: 'divider',
          color: 'text.primary',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: 14,
          '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'custom.surfaceSelected' },
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
          border: '1.5px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          Upload a source to get started
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          0 sources
        </Typography>
      </Box>
    </Box>
  );
}

export default function Page() {
  const { uploadedDocs, selectedDoc, selectedSessionId, handleUpload, handleClosePreview } = useDocumentContext();

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

  const hasDocuments = uploadedDocs.length > 0;

  if (!hasDocuments) {
    return <EmptyState onUpload={handleUpload} />;
  }

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
        <Chat
          sessionId={selectedSessionId}
          documentId={selectedDoc?.id}
        />
      </Box>
    </>
  );
}