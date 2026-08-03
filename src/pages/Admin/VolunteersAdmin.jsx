import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Typography, Chip } from '@mui/material';
import { Search, Download, Check, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const VolunteersAdmin = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/volunteers.php');
      if (res.success && res.data) {
        setVolunteers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.post(`/volunteers.php?action=status`, { id, status });
      if (res.success) {
        fetchVolunteers();
      }
    } catch (err) {
      // Handled
    }
  };

  const handleDownloadCSV = () => {
    // Generate CSV contents client-side
    const headers = ['ID', 'Name', 'Email', 'Mobile', 'Skills Interest', 'Address/Details', 'Status', 'Date Joined'];
    const rows = volunteers.map(v => [
      v.id,
      v.name,
      v.email,
      v.mobile,
      v.skills,
      `"${(v.address || '').replace(/"/g, '""')}"`,
      v.status,
      v.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `volunteers_roster_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.skills || '').toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading volunteers list...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search roster by name, email or skills..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: <Search size={16} style={{ marginRight: 8, opacity: 0.7 }} />
          }}
        />
        <Button variant="outlined" startIcon={<Download size={16} />} onClick={handleDownloadCSV} disabled={volunteers.length === 0}>
          Export CSV Roster
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="volunteers registry table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Date Registered</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Skills Interest</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVolunteers.map((vol) => (
              <TableRow key={vol.id}>
                <TableCell sx={{ fontSize: '0.8rem' }}>
                  {new Date(vol.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{vol.name}</TableCell>
                <TableCell>{vol.email}</TableCell>
                <TableCell>{vol.mobile}</TableCell>
                <TableCell>
                  <Chip label={vol.skills} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', maxWidth: 220 }}>{vol.address}</TableCell>
                <TableCell>
                  <Chip 
                    label={vol.status} 
                    size="small" 
                    color={vol.status === 'Approved' ? 'success' : vol.status === 'Pending' ? 'warning' : 'error'}
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      color="success" 
                      size="small" 
                      onClick={() => handleStatusChange(vol.id, 'Approved')}
                      disabled={vol.status === 'Approved'}
                    >
                      <Check size={16} />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small" 
                      onClick={() => handleStatusChange(vol.id, 'Rejected')}
                      disabled={vol.status === 'Rejected'}
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredVolunteers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No volunteers in roster.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VolunteersAdmin;
