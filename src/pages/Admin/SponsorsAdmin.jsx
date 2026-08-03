import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Typography } from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const SponsorsAdmin = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('Gold');
  const [priority, setPriority] = useState(1);
  
  const [submitting, setSubmitting] = useState(false);

  const fetchSponsors = async () => {
    try {
      const res = await api.get('/sponsors.php');
      if (res.success && res.data) {
        setSponsors(res.data);
      }
    } catch (err) {
      console.error('Failed to load sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const openAddModal = () => {
    setSelectedSponsor(null);
    setName('');
    setLogoUrl('');
    setWebsite('');
    setCategory('Gold');
    setPriority(sponsors.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (sp) => {
    setSelectedSponsor(sp);
    setName(sp.name || '');
    setLogoUrl(sp.logo_url || '');
    setWebsite(sp.website || '');
    setCategory(sp.category || 'Gold');
    setPriority(sp.priority || 1);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        logo_url: logoUrl,
        website,
        category,
        priority
      };

      let res;
      if (selectedSponsor) {
        payload.id = selectedSponsor.id;
        res = await api.post('/sponsors.php?action=edit', payload);
      } else {
        res = await api.post('/sponsors.php?action=add', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchSponsors();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sponsor?')) return;
    try {
      const res = await api.post('/sponsors.php?action=delete', { id });
      if (res.success) {
        fetchSponsors();
      }
    } catch (err) {
      // Handled
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading sponsors...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Display partners grouped by sponsorship tier (Gold, Silver, Bronze) on your website.
        </Typography>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddModal}>
          Add Partner / Sponsor
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="sponsors board table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Logo</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Sponsor Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Tier Level</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Website Link</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Priority Order</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sponsors.map((sp) => (
              <TableRow key={sp.id}>
                <TableCell>
                  <Box
                    component="img"
                    src={sp.logo_url}
                    alt={sp.name}
                    sx={{ width: 80, height: 40, objectFit: 'contain', borderRadius: 1, border: '1px solid', borderColor: 'divider', p: 0.5, bgcolor: '#FFF' }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{sp.name}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: sp.category === 'Gold' ? 'primary.main' : sp.category === 'Silver' ? 'text.secondary' : 'warning.dark' }}>
                  {sp.category}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }} noWrap>{sp.website}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{sp.priority}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => openEditModal(sp)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(sp.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sponsors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No partners listed.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sponsor Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedSponsor ? 'Edit Partner Details' : 'Add New Partner'}
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Sponsor / Partner Name" 
              required 
              fullWidth 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField 
              label="Logo Image URL" 
              required 
              fullWidth 
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <TextField 
              label="Sponsor Website Link" 
              fullWidth 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <TextField 
              label="Sponsorship Tier" 
              select
              required 
              fullWidth 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Gold">Gold Partner</MenuItem>
              <MenuItem value="Silver">Silver Partner</MenuItem>
              <MenuItem value="Bronze">Bronze Partner</MenuItem>
            </TextField>
            <TextField 
              label="Display Sorting Priority" 
              type="number" 
              required
              fullWidth 
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Sponsor'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default SponsorsAdmin;
