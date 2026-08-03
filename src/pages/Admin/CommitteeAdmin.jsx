import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Avatar, Typography } from '@mui/material';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const CommitteeAdmin = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // CRUD Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/committee.php');
      if (res.success && res.data) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error('Failed to load committee:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setSelectedMember(null);
    setName('');
    setPosition('');
    setDepartment('Executive Committee');
    setPhotoUrl('');
    setMobile('');
    setEmail('');
    setBio('');
    setDisplayOrder(members.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setName(member.name || '');
    setPosition(member.position || '');
    setDepartment(member.department || 'Executive Committee');
    setPhotoUrl(member.photo_url || '');
    setMobile(member.mobile || '');
    setEmail(member.email || '');
    setBio(member.bio || '');
    setDisplayOrder(member.display_order || 1);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        position,
        department,
        photo_url: photoUrl,
        mobile,
        email,
        bio,
        display_order: displayOrder
      };

      let res;
      if (selectedMember) {
        payload.id = selectedMember.id;
        res = await api.post('/committee.php?action=edit', payload);
      } else {
        res = await api.post('/committee.php?action=add', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchMembers();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this committee member?')) return;
    try {
      const res = await api.post('/committee.php?action=delete', { id });
      if (res.success) {
        fetchMembers();
      }
    } catch (err) {
      // Handled
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.position.toLowerCase().includes(search.toLowerCase()) ||
    m.department.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading committee list...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search roster by name, position or department..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: <Search size={16} style={{ marginRight: 8, opacity: 0.7 }} />
          }}
        />
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddModal}>
          Add Trustee / Member
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="committee roster table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Profile</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Position</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Avatar src={member.photo_url} sx={{ bgcolor: 'primary.main' }}>
                    {member.name.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{member.name}</TableCell>
                <TableCell sx={{ fontWeight: 650 }}>{member.position}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>
                  {member.email && <div>Email: {member.email}</div>}
                  {member.mobile && <div>Phone: {member.mobile}</div>}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{member.display_order}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => openEditModal(member)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(member.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No committee members matching the search query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Member Form Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedMember ? 'Edit Committee Member' : 'Add Committee Member'}
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Full Name" 
              required 
              fullWidth 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField 
              label="Position / Designation" 
              required 
              fullWidth 
              placeholder="e.g. Vice President, Treasurer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <TextField 
              label="Department Category" 
              select
              required 
              fullWidth 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <MenuItem value="Executive Committee">Executive Committee</MenuItem>
              <MenuItem value="Youth Committee">Youth Committee</MenuItem>
              <MenuItem value="Finance & Trust">Finance & Trust</MenuItem>
            </TextField>
            <TextField 
              label="Photo URL" 
              fullWidth 
              placeholder="Link to avatar image"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            <TextField 
              label="Mobile Helpline" 
              fullWidth 
              placeholder="10 digits number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <TextField 
              label="Email Address" 
              type="email"
              fullWidth 
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField 
              label="Bio Details" 
              multiline 
              rows={2}
              fullWidth 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <TextField 
              label="Sorting Order Index" 
              type="number" 
              required
              fullWidth 
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Member'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default CommitteeAdmin;
