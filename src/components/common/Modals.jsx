import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Buttons';

// 1. General Modal/Dialog component
export const Modal = ({ open, onClose, title, children, maxWidth = 'sm', fullWidth = true }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          p: 2,
          position: 'relative',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', px: 2, py: 1 }}>
          {title}
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <X size={20} />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 2 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// 2. Confirmation Dialog component
export const ConfirmationDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', severity = 'primary' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          p: 2,
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <SecondaryButton size="small" onClick={onClose}>
          {cancelText}
        </SecondaryButton>
        <PrimaryButton
          size="small"
          onClick={() => {
            if (onConfirm) onConfirm();
            onClose();
          }}
          sx={severity === 'error' ? {
            background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
            }
          } : {}}
        >
          {confirmText}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
