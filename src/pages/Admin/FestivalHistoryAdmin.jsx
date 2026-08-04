import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Stack } from '@mui/material';
import { Plus, Edit3, Trash2, Clock } from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../../components/common/Modals';

const FestivalHistoryAdmin = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const fetchTimeline = async () => {
    try {
      const res = await api.get('/history.php');
      if (res.success && res.data) {
        setTimeline(res.data);
      }
    } catch (err) {
      console.error('Failed to load festival history timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const openAddModal = () => {
    setSelectedMilestone(null);
    setYear('');
    setTitle('');
    setDescription('');
    setDisplayOrder('0');
    setModalOpen(true);
  };

  const openEditModal = (ms) => {
    setSelectedMilestone(ms);
    setYear(ms.year || '');
    setTitle(ms.title || '');
    setDescription(ms.description || '');
    setDisplayOrder(String(ms.display_order || 0));
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        year,
        title,
        description,
        display_order: parseInt(displayOrder || '0', 10)
      };

      let res;
      if (selectedMilestone) {
        payload.id = selectedMilestone.id;
        res = await api.post('/history.php?action=edit_timeline', payload);
      } else {
        res = await api.post('/history.php?action=add_timeline', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchTimeline();
      }
    } catch (err) {
      // Toast handles errors
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this historical milestone?')) return;
    try {
      const res = await api.post('/history.php?action=delete_timeline', { id });
      if (res.success) {
        fetchTimeline();
      }
    } catch (err) {
      // Toast handles errors
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography>Loading Festival History Milestones...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Festival History & Retrospective CMS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage chronological milestones and legacy highlights for the Festival History public page.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddModal}>
          Add Milestone
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="festival history table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Year</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Milestone Title</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 800, align: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeline.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ fontWeight: 700 }}>{item.display_order || 0}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>{item.year}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                <TableCell color="text.secondary" sx={{ maxWidth: 400 }}>{item.description}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton color="primary" onClick={() => openEditModal(item)}>
                      <Edit3 size={16} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {timeline.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No historical milestones found. Click "Add Milestone" to create your first milestone.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Form */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedMilestone ? 'Edit Historical Milestone' : 'Add Historical Milestone'}
          maxWidth="sm"
        >
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField
              label="Milestone Year (e.g. 2001)"
              required
              fullWidth
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <TextField
              label="Milestone Title"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Milestone Description"
              required
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Display Order (Numeric, lower numbers display first)"
              type="number"
              fullWidth
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Milestone'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default FestivalHistoryAdmin;
