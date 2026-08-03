import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Typography, Chip, Card, CardContent } from '@mui/material';
import { Mail, Trash2, Eye } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const ContactAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/contact.php');
      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await api.post('/contact.php?action=delete', { id });
      if (res.success) {
        fetchMessages();
      }
    } catch (err) {
      // Handled
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    setReplyBody('');

    // Mark as Read if unread
    if (msg.status === 'Unread') {
      try {
        const res = await api.post('/contact.php?action=status', { id: msg.id, status: 'Read' });
        if (res.success) {
          fetchMessages();
        }
      } catch (err) {
        // silent
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyBody) return;
    setSubmitting(true);
    try {
      // Send dynamic reply
      const res = await api.post('/contact.php?action=reply', {
        id: selectedMessage.id,
        reply: replyBody
      });
      if (res.success) {
        setSelectedMessage(null);
        fetchMessages();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading inbox...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="contact inbox table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Date Received</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Sender</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Message Preview</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} sx={{ bgcolor: msg.status === 'Unread' ? 'action.hover' : 'inherit' }}>
                <TableCell sx={{ fontSize: '0.8rem' }}>
                  {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell sx={{ fontWeight: msg.status === 'Unread' ? 800 : 700 }}>
                  {msg.name}
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{msg.email}</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: msg.status === 'Unread' ? 800 : 500 }}>{msg.subject}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', maxWidth: 220 }} noWrap>{msg.message}</TableCell>
                <TableCell>
                  <Chip 
                    label={msg.status} 
                    size="small" 
                    color={msg.status === 'Unread' ? 'error' : msg.status === 'Replied' ? 'success' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => handleOpenMessage(msg)}>
                    <Eye size={16} />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(msg.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No messages received yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <Modal
          open={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={`Message Details: ${selectedMessage.name}`}
          maxWidth="xs"
        >
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Email: {selectedMessage.email} | Received: {new Date(selectedMessage.created_at).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Subject: {selectedMessage.subject}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, color: 'text.secondary' }}>
                {selectedMessage.message}
              </Typography>
            </CardContent>
          </Card>

          {selectedMessage.reply_text ? (
            <Card variant="outlined" sx={{ bgcolor: 'success.light', color: 'success.contrastText', mb: 1, p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Replied on Desk:</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedMessage.reply_text}</Typography>
            </Card>
          ) : (
            <Box component="form" onSubmit={handleSendReply} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Send a Reply Desk Response"
                required
                multiline
                rows={3}
                fullWidth
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Sending...' : 'Record Reply'}
              </Button>
            </Box>
          )}
        </Modal>
      )}
    </Box>
  );
};

export default ContactAdmin;
