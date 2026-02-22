'use client'

import { Box, Typography, Button, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useFileUpload } from '@/hooks/useFileUpload';

export default function Page() {
  const { uploading, fileInputRef, openFilePicker, handleFileChange } = useFileUpload();

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
        {uploading ? (
          <CircularProgress size={28} sx={{ color: 'primary.main' }} />
        ) : (
          <UploadFileIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        )}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: 20 }}>
        Add a source to get started
      </Typography>

      <Button
        variant="outlined"
        onClick={openFilePicker}
        disabled={uploading}
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
        {uploading ? 'Uploading...' : 'Upload a PDF'}
      </Button>
    </Box>
  );
}