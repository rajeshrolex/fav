import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Typography, Button, Paper, Tabs, Tab, Stack, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider } from '@mui/material';
import { Trash2, Edit3, Plus, Save } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const AboutCMS = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeline, setTimeline] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // Timeline form state
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [milestoneYear, setMilestoneYear] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    try {
      const res = await api.get('/about.php');
      if (res.success && res.data) {
        setDetails(res.data.details || {});
        setTimeline(res.data.timeline || []);
      }
    } catch (err) {
      console.error('Failed to load about CMS details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (key, val) => {
    setDetails(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/about.php?action=update_details', details);
      if (res.success) {
        // success toast by interceptor
      }
    } catch (err) {
      // toast error
    } finally {
      setSubmitting(false);
    }
  };

  // Timeline CRUD
  const openAddMilestone = () => {
    setSelectedMilestone(null);
    setMilestoneYear('');
    setMilestoneTitle('');
    setMilestoneDesc('');
    setTimelineModalOpen(true);
  };

  const openEditMilestone = (ms) => {
    setSelectedMilestone(ms);
    setMilestoneYear(ms.year || '');
    setMilestoneTitle(ms.title || '');
    setMilestoneDesc(ms.description || '');
    setTimelineModalOpen(true);
  };

  const handleSaveMilestone = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        year: milestoneYear,
        title: milestoneTitle,
        description: milestoneDesc
      };

      let res;
      if (selectedMilestone) {
        payload.id = selectedMilestone.id;
        res = await api.post('/about.php?action=edit_timeline', payload);
      } else {
        res = await api.post('/about.php?action=add_timeline', payload);
      }

      if (res.success) {
        setTimelineModalOpen(false);
        fetchData();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (!window.confirm('Are you sure you want to delete this historical milestone?')) return;
    try {
      const res = await api.post('/about.php?action=delete_timeline', { id });
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      // Handled
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading About CMS Manager...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="about cms tabs">
          <Tab label="Chronological Timeline" />
          <Tab label="Executive Board & Stats" />
        </Tabs>
      </Box>

      {/* Tab 1: Chronological Timeline */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Add historical archive events that display on the public Retrospective page.
            </Typography>
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddMilestone}>
              Add Milestone
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Table aria-label="history timeline table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Milestone Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 800, align: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeline.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ fontWeight: 700 }}>{item.year}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{item.title}</TableCell>
                    <TableCell color="text.secondary" sx={{ maxWidth: 350 }}>{item.description}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => openEditMilestone(item)}>
                        <Edit3 size={16} />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteMilestone(item.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {timeline.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No milestones registered yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 2: Executive Desk Messages & Stats */}
      {tabValue === 1 && (
        <Paper component="form" onSubmit={handleUpdateDetails} sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 3 }}>
            Welfare Trust Messages & Impact Metrics
          </Typography>

          <Grid container spacing={3.5}>
            {/* Leadership desk */}
            <Grid item xs={12}>
              <TextField
                label="President Desk Quote Message"
                multiline
                rows={3}
                fullWidth
                value={details.about_preview_president_msg || ''}
                onChange={(e) => handleInputChange('about_preview_president_msg', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Secretary Desk Quote Message"
                multiline
                rows={3}
                fullWidth
                value={details.about_preview_secretary_msg || ''}
                onChange={(e) => handleInputChange('about_preview_secretary_msg', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Trust Impact Metrics (Counters)</Typography>
            </Grid>

            {/* Legacy Years */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Years of Legacy Counter Value (e.g. 25+)"
                fullWidth
                value={details.stat_legacy_value || ''}
                onChange={(e) => handleInputChange('stat_legacy_value', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Legacy Counter Label"
                fullWidth
                value={details.stat_legacy_label || ''}
                onChange={(e) => handleInputChange('stat_legacy_label', e.target.value)}
              />
            </Grid>

            {/* Committee members */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Active Committee Members Counter Value (e.g. 150+)"
                fullWidth
                value={details.stat_committee_value || ''}
                onChange={(e) => handleInputChange('stat_committee_value', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Committee Members Label"
                fullWidth
                value={details.stat_committee_label || ''}
                onChange={(e) => handleInputChange('stat_committee_label', e.target.value)}
              />
            </Grid>

            {/* Volunteers */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Registered Volunteers Counter Value (e.g. 2,500+)"
                fullWidth
                value={details.stat_volunteers_value || ''}
                onChange={(e) => handleInputChange('stat_volunteers_value', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Volunteers Counter Label"
                fullWidth
                value={details.stat_volunteers_label || ''}
                onChange={(e) => handleInputChange('stat_volunteers_label', e.target.value)}
              />
            </Grid>

            {/* Attendees */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Annual Attendees Counter Value (e.g. 50K+)"
                fullWidth
                value={details.stat_attendees_value || ''}
                onChange={(e) => handleInputChange('stat_attendees_value', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Attendees Counter Label"
                fullWidth
                value={details.stat_attendees_label || ''}
                onChange={(e) => handleInputChange('stat_attendees_label', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<Save size={16} />} disabled={submitting}>
                {submitting ? 'Saving settings...' : 'Save Executive CMS Settings'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Milestone Modal */}
      {timelineModalOpen && (
        <Modal
          open={timelineModalOpen}
          onClose={() => setTimelineModalOpen(false)}
          title={selectedMilestone ? 'Edit Historical Milestone' : 'Add Historical Milestone'}
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSaveMilestone} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Milestone Year (e.g. 2001)" 
              required 
              fullWidth 
              value={milestoneYear}
              onChange={(e) => setMilestoneYear(e.target.value)}
            />
            <TextField 
              label="Milestone Title" 
              required 
              fullWidth 
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
            />
            <TextField 
              label="Milestone Description details" 
              required 
              multiline 
              rows={3}
              fullWidth 
              value={milestoneDesc}
              onChange={(e) => setMilestoneDesc(e.target.value)}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setTimelineModalOpen(false)} variant="outlined" fullWidth>
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

export default AboutCMS;
