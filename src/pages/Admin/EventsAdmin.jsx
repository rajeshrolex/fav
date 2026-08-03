import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Typography, Tabs, Tab, Checkbox, FormControlLabel } from '@mui/material';
import { Plus, Edit, Trash2, Search, Calendar, Users } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const EventsAdmin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // CRUD Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events.php');
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/events.php', { params: { action: 'registrations' } });
      if (res.success && res.data) {
        setRegistrations(res.data);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchEvents(), fetchRegistrations()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setSelectedEvent(null);
    setTitle('');
    setDescription('');
    setEventDate('');
    setEventTime('');
    setVenue('');
    setCategory('Cultural');
    setCoverImage('');
    setRegistrationLink('');
    setStatus('Upcoming');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setSelectedEvent(ev);
    setTitle(ev.title || '');
    setDescription(ev.description || '');
    setEventDate(ev.event_date || '');
    setEventTime(ev.event_time || '');
    setVenue(ev.venue || '');
    setCategory(ev.category || 'Cultural');
    setCoverImage(ev.cover_image || '');
    setRegistrationLink(ev.registration_link || '');
    setStatus(ev.status || 'Upcoming');
    setIsFeatured(Boolean(ev.is_featured));
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        event_date: eventDate,
        event_time: eventTime,
        venue,
        category,
        cover_image: coverImage,
        registration_link: registrationLink,
        status,
        is_featured: isFeatured ? 1 : 0
      };

      let res;
      if (selectedEvent) {
        payload.id = selectedEvent.id;
        res = await api.post('/events.php?action=edit', payload);
      } else {
        res = await api.post('/events.php?action=add', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event? All associated registrations will also be deleted.')) return;
    try {
      const res = await api.post('/events.php?action=delete', { id });
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      // Handled
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.venue.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.event_title.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading Events Manager...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="events manager tabs">
          <Tab icon={<Calendar size={18} />} iconPosition="start" label="Events Directory" />
          <Tab icon={<Users size={18} />} iconPosition="start" label="Event Registrations" />
        </Tabs>
      </Box>

      {/* SEARCH & ADD PANEL */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder={tabValue === 0 ? "Search events by title, venue or category..." : "Search registrations by name or event..."}
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 320 } }}
          InputProps={{
            startAdornment: <Search size={16} style={{ marginRight: 8, opacity: 0.7 }} />
          }}
        />
        {tabValue === 0 && (
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddModal}>
            Add Event / Campaign
          </Button>
        )}
      </Box>

      {/* Tab 1: Events Directory */}
      {tabValue === 0 && (
        <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Table aria-label="events directory table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Event Title</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Venue</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Featured</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{ev.title}</TableCell>
                  <TableCell>{ev.category}</TableCell>
                  <TableCell color="text.secondary">{ev.venue}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: ev.status === 'Upcoming' ? 'success.main' : ev.status === 'Past' ? 'text.secondary' : 'error.main' }}>
                    {ev.status}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {ev.is_featured ? '⭐ Yes' : 'No'}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" size="small" onClick={() => openEditModal(ev)}>
                      <Edit size={16} />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(ev.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No events registered.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab 2: Registrations */}
      {tabValue === 1 && (
        <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Table aria-label="registrations table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Submission Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Event Target</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Tickets</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell sx={{ fontSize: '0.8rem' }}>
                    {new Date(reg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{reg.event_title}</TableCell>
                  <TableCell sx={{ fontWeight: 650 }}>{reg.name}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>{reg.phone}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{reg.tickets}</TableCell>
                </TableRow>
              ))}
              {filteredRegistrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No registrations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Event Form Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedEvent ? 'Edit Event Details' : 'Add New Event'}
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Event Title" 
              required 
              fullWidth 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField 
              label="Event Category" 
              required 
              fullWidth 
              placeholder="e.g. Cultural, Youth Wing, Social Service"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField 
              label="Date (YYYY-MM-DD)" 
              type="date"
              required 
              fullWidth 
              InputLabelProps={{ shrink: true }}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <TextField 
              label="Time Range (e.g. 10:00 AM - 04:00 PM)" 
              required 
              fullWidth 
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
            <TextField 
              label="Venue Location" 
              required 
              fullWidth 
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
            <TextField 
              label="Cover Image URL" 
              fullWidth 
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
            <TextField 
              label="External Registration Link (Optional)" 
              fullWidth 
              placeholder="Link to external ticketing site if any"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
            />
            <TextField 
              label="Status" 
              select
              required 
              fullWidth 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Past">Past</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={isFeatured} 
                  onChange={(e) => setIsFeatured(e.target.checked)} 
                  color="primary"
                />
              }
              label="Feature this event on Homepage"
            />

            <TextField 
              label="Event Description" 
              required 
              multiline 
              rows={3}
              fullWidth 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Event'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default EventsAdmin;
