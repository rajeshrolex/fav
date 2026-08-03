import React, { useState, useEffect } from 'react';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Typography } from '@mui/material';
import { Plus, Trash2, Image } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const GalleryAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Festivals');
  const [mediaType, setMediaType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery.php');
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setTitle('');
    setCategory('Festivals');
    setMediaType('image');
    setMediaUrl('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/gallery.php?action=add', {
        title,
        category,
        media_type: mediaType,
        media_url: mediaUrl
      });
      if (res.success) {
        setModalOpen(false);
        fetchGallery();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    try {
      const res = await api.post('/gallery.php?action=delete', { id });
      if (res.success) {
        fetchGallery();
      }
    } catch (err) {
      // Handled
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading gallery albums...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Upload and categorize photos that display on the public Gallery page.
        </Typography>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddModal}>
          Upload Media Item
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="gallery media table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Preview</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>URL</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box
                    component="img"
                    src={item.media_url}
                    alt={item.title}
                    sx={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=150';
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{item.title || 'Untitled Memory'}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{item.media_type}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', maxWidth: 200 }} noWrap>{item.media_url}</TableCell>
                <TableCell>
                  <IconButton color="error" size="small" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No media cataloged yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Media Upload Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Gallery Media Item"
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Media Title / Caption" 
              fullWidth 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField 
              label="Category Label" 
              select
              required 
              fullWidth 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Festivals">Festivals</MenuItem>
              <MenuItem value="Social Work">Social Work</MenuItem>
              <MenuItem value="Cultural">Cultural</MenuItem>
              <MenuItem value="Community">Community</MenuItem>
            </TextField>
            <TextField 
              label="Media Type" 
              select
              required 
              fullWidth 
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <MenuItem value="image">Image File</MenuItem>
              <MenuItem value="video">Video Link</MenuItem>
            </TextField>
            <TextField 
              label="Media URL" 
              required
              fullWidth 
              placeholder="e.g. https://images.unsplash.com/... or media path"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Uploading...' : 'Add Item'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default GalleryAdmin;
