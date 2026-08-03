import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Typography, Button, Paper, Tabs, Tab, Stack, IconButton, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { Trash2, Edit3, Plus, Save } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const HomeCMS = () => {
  const [tabValue, setTabValue] = useState(0);
  const [slides, setSlides] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Slide form state
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideDesc, setSlideDesc] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideBtnText, setSlideBtnText] = useState('');
  const [slideBtnLink, setSlideBtnLink] = useState('');
  const [slideOrder, setSlideOrder] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    try {
      const settingsRes = await api.get('/settings.php');
      if (settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data);
      }

      const slidesRes = await api.get('/home.php');
      if (slidesRes.success && slidesRes.data) {
        setSlides(slidesRes.data);
      }
    } catch (err) {
      console.error('Failed to load home CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update general settings
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/settings.php?action=update', settings);
      if (res.success) {
        // toast success
      }
    } catch (err) {
      // toast error via axios interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (key, val) => {
    setSettings(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Slides CRUD
  const openAddSlideModal = () => {
    setSelectedSlide(null);
    setSlideTitle('');
    setSlideDesc('');
    setSlideImage('');
    setSlideBtnText('');
    setSlideBtnLink('');
    setSlideOrder(slides.length + 1);
    setSlideModalOpen(true);
  };

  const openEditSlideModal = (slide) => {
    setSelectedSlide(slide);
    setSlideTitle(slide.title || '');
    setSlideDesc(slide.description || '');
    setSlideImage(slide.image_url || '');
    setSlideBtnText(slide.button_text || '');
    setSlideBtnLink(slide.button_link || '');
    setSlideOrder(slide.display_order || 1);
    setSlideModalOpen(true);
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: slideTitle,
        description: slideDesc,
        image_url: slideImage,
        button_text: slideBtnText,
        button_link: slideBtnLink,
        display_order: slideOrder
      };

      let res;
      if (selectedSlide) {
        payload.id = selectedSlide.id;
        res = await api.post('/home.php?action=edit', payload);
      } else {
        res = await api.post('/home.php?action=add', payload);
      }

      if (res.success) {
        setSlideModalOpen(false);
        fetchData();
      }
    } catch (err) {
      // toast error via interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await api.post('/home.php?action=delete', { id });
      if (res.success) {
        fetchData();
      }
    } catch (err) {
      // error handled
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading Home CMS Manager...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="home cms tabs">
          <Tab label="Hero Banner Slides" />
          <Tab label="Homepage Content Settings" />
        </Tabs>
      </Box>

      {/* Tab 1: Hero Banner Slides CRUD */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Upload backgrounds and set button links for your homepage hero slideshow.
            </Typography>
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddSlideModal}>
              Add Hero Slide
            </Button>
          </Box>

          <Grid container spacing={3.5}>
            {slides.map((slide) => (
              <Grid item xs={12} sm={6} md={4} key={slide.id}>
                <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={slide.image_url || 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=600'}
                    alt={slide.title}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }} noWrap>
                      {slide.title || 'Untitled Banner'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      mb: 2.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      height: 40
                    }}>
                      {slide.description || 'No description provided.'}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }} color="text.secondary">
                        Order: {slide.display_order}
                      </Typography>
                      <Box>
                        <IconButton color="primary" onClick={() => openEditSlideModal(slide)}>
                          <Edit3 size={16} />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteSlide(slide.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {slides.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px dotted', borderColor: 'divider' }}>
              <Typography color="text.secondary">No slides added yet. Click Add Hero Slide above.</Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* Tab 2: Welcome Section Content */}
      {tabValue === 1 && (
        <Paper component="form" onSubmit={handleUpdateSettings} sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.2rem', mb: 3 }}>
            Welcome Section and President Board settings
          </Typography>

          <Grid container spacing={3}>
            {/* Welcome banner settings */}
            <Grid item xs={12}>
              <TextField
                label="Hero Welcome Title"
                fullWidth
                value={settings.hero_title || ''}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hero Button Text"
                fullWidth
                value={settings.hero_btn_text || ''}
                onChange={(e) => handleInputChange('hero_btn_text', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hero Button Link"
                fullWidth
                value={settings.hero_btn_link || ''}
                onChange={(e) => handleInputChange('hero_btn_link', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Home About Preview Details</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="About Heading"
                fullWidth
                value={settings.about_preview_title || ''}
                onChange={(e) => handleInputChange('about_preview_title', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="About Subtitle"
                fullWidth
                value={settings.about_preview_subtitle || ''}
                onChange={(e) => handleInputChange('about_preview_subtitle', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Paragraph 1 (Welcome Message)"
                multiline
                rows={3}
                fullWidth
                value={settings.about_preview_text1 || ''}
                onChange={(e) => handleInputChange('about_preview_text1', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Paragraph 2 (Welcome Message)"
                multiline
                rows={3}
                fullWidth
                value={settings.about_preview_text2 || ''}
                onChange={(e) => handleInputChange('about_preview_text2', e.target.value)}
              />
            </Grid>

            {/* Mission Vision Settings */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mission Statement Summary"
                multiline
                rows={3}
                fullWidth
                value={settings.about_preview_mission || ''}
                onChange={(e) => handleInputChange('about_preview_mission', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vision Statement Summary"
                multiline
                rows={3}
                fullWidth
                value={settings.about_preview_vision || ''}
                onChange={(e) => handleInputChange('about_preview_vision', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" startIcon={<Save size={16} />} disabled={submitting}>
                {submitting ? 'Saving settings...' : 'Save Home CMS Settings'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Slide Edit Modal */}
      {slideModalOpen && (
        <Modal
          open={slideModalOpen}
          onClose={() => setSlideModalOpen(false)}
          title={selectedSlide ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSaveSlide} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Banner Title" 
              required 
              fullWidth 
              value={slideTitle}
              onChange={(e) => setSlideTitle(e.target.value)}
            />
            <TextField 
              label="Description / Subtext" 
              required 
              multiline 
              rows={2}
              fullWidth 
              value={slideDesc}
              onChange={(e) => setSlideDesc(e.target.value)}
            />
            <TextField 
              label="Slide Background Image URL" 
              required 
              fullWidth 
              value={slideImage}
              onChange={(e) => setSlideImage(e.target.value)}
            />
            <TextField 
              label="Call to Action Button Text" 
              fullWidth 
              value={slideBtnText}
              onChange={(e) => setSlideBtnText(e.target.value)}
            />
            <TextField 
              label="Call to Action Button Link" 
              fullWidth 
              value={slideBtnLink}
              onChange={(e) => setSlideBtnLink(e.target.value)}
            />
            <TextField 
              label="Display Priority Order" 
              type="number" 
              required
              fullWidth 
              value={slideOrder}
              onChange={(e) => setSlideOrder(parseInt(e.target.value))}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setSlideModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Slide'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default HomeCMS;
