import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Typography, Button, Paper, Tabs, Tab, Stack, Select, MenuItem, InputLabel, FormControl, Divider, Alert } from '@mui/material';
import { Save, UserPlus, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useConfig } from '../../context/ConfigContext';

const SettingsAdmin = () => {
  const [tabValue, setTabValue] = useState(0);
  const { settings, fetchSettings } = useConfig();
  const [localSettings, setLocalSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // User creation states
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Editor');
  const [submitting, setSubmitting] = useState(false);

  // SEO page select states
  const [selectedPage, setSelectedPage] = useState('home');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
      setLoading(false);
    }
  }, [settings]);

  // Load SEO values on select page change
  useEffect(() => {
    const fetchPageSeo = async () => {
      try {
        const res = await api.get('/settings.php', { params: { action: 'seo', page: selectedPage } });
        if (res.success && res.data) {
          setMetaTitle(res.data.meta_title || '');
          setMetaDescription(res.data.meta_description || '');
          setMetaKeywords(res.data.meta_keywords || '');
          setOgTitle(res.data.og_title || '');
          setOgDescription(res.data.og_description || '');
          setOgImage(res.data.og_image || '');
        } else {
          setMetaTitle('');
          setMetaDescription('');
          setMetaKeywords('');
          setOgTitle('');
          setOgDescription('');
          setOgImage('');
        }
      } catch (err) {
        console.error('Failed to load SEO metadata:', err);
      }
    };
    fetchPageSeo();
  }, [selectedPage]);

  const handleInputChange = (key, val) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/settings.php?action=update', localSettings);
      if (res.success) {
        fetchSettings(); // Re-sync app wrapper
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/auth.php?action=register', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole
      });
      if (res.success) {
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('Editor');
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/settings.php?action=update_seo', {
        page_name: selectedPage,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage
      });
      if (res.success) {
        // toast success by interceptor
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
        <Typography>Loading Settings Panel...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings panel tabs">
          <Tab label="General Settings" />
          <Tab label="Search Engine Optimization (SEO)" />
          <Tab label="Manage Admins" />
        </Tabs>
      </Box>

      {/* Tab 1: General Settings */}
      {tabValue === 0 && (
        <Paper component="form" onSubmit={handleSaveSettings} sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 3 }}>
            Global Branding & Contact settings
          </Typography>

          <Grid container spacing={3.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Site Name / Title"
                required
                fullWidth
                value={localSettings.site_name || ''}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Site Support Email"
                required
                fullWidth
                value={localSettings.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Primary Brand Color (HEX)"
                required
                fullWidth
                value={localSettings.theme_primary || ''}
                onChange={(e) => handleInputChange('theme_primary', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Secondary Accent Color (HEX)"
                required
                fullWidth
                value={localSettings.theme_secondary || ''}
                onChange={(e) => handleInputChange('theme_secondary', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Office Address"
                required
                multiline
                rows={2}
                fullWidth
                value={localSettings.contact_address || ''}
                onChange={(e) => handleInputChange('contact_address', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Helpline Call Desk Number"
                required
                fullWidth
                value={localSettings.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Google Maps Embed URL Link"
                fullWidth
                value={localSettings.google_map_iframe || ''}
                onChange={(e) => handleInputChange('google_map_iframe', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<Save size={16} />} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tab 2: SEO Settings */}
      {tabValue === 1 && (
        <Paper component="form" onSubmit={handleSaveSeo} sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 3 }}>
            Page-Level Metadata Configuration
          </Typography>

          <Grid container spacing={3.5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-page-seo-label">Target Page</InputLabel>
                <Select
                  labelId="select-page-seo-label"
                  value={selectedPage}
                  label="Target Page"
                  onChange={(e) => setSelectedPage(e.target.value)}
                >
                  <MenuItem value="home">Home Page</MenuItem>
                  <MenuItem value="about">About Page</MenuItem>
                  <MenuItem value="committee">Committee Directory</MenuItem>
                  <MenuItem value="history">History Timeline</MenuItem>
                  <MenuItem value="events">Events Board</MenuItem>
                  <MenuItem value="gallery">Photo Gallery</MenuItem>
                  <MenuItem value="sponsors">Sponsors Panel</MenuItem>
                  <MenuItem value="volunteer">Volunteer Portal</MenuItem>
                  <MenuItem value="contact">Contact Desk</MenuItem>
                  <MenuItem value="news">News & Articles</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Meta Title Tag"
                required
                fullWidth
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Meta Description Tag"
                required
                multiline
                rows={2}
                fullWidth
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Meta Keywords (Comma separated)"
                fullWidth
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Open Graph Facebook/Twitter Previews</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="OG Title"
                fullWidth
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="OG Image URL"
                fullWidth
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="OG Description"
                multiline
                rows={2}
                fullWidth
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<Save size={16} />} disabled={submitting}>
                {submitting ? 'Saving SEO...' : 'Save SEO Metadata'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tab 3: Admin User Creation */}
      {tabValue === 2 && (
        <Paper component="form" onSubmit={handleCreateUser} sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>
            Register New Administrator
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Create additional administrative accounts. Only Super Admins can add accounts.
          </Typography>

          <Grid container spacing={3.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                required
                fullWidth
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Login Password"
                type="password"
                required
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="select-role-label">Authorization Role</InputLabel>
                <Select
                  labelId="select-role-label"
                  value={newRole}
                  label="Authorization Role"
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <MenuItem value="Super Admin">Super Admin (All permissions)</MenuItem>
                  <MenuItem value="Admin">Admin (Cannot manage settings)</MenuItem>
                  <MenuItem value="Editor">Editor (Read-only, except events & roster)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<UserPlus size={16} />} disabled={submitting}>
                {submitting ? 'Registering...' : 'Create Account'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default SettingsAdmin;
