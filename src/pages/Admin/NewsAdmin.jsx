import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, IconButton, Typography } from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Modal } from '../../components/common/Modals';

const NewsAdmin = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD Modal Form States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Press Release');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [publishDate, setPublishDate] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/news.php');
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error('Failed to load news articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openAddModal = () => {
    setSelectedArticle(null);
    setTitle('');
    setSlug('');
    setCategory('Press Release');
    setAuthor('Admin');
    setSummary('');
    setContent('');
    setFeaturedImage('');
    setPublishDate(new Date().toISOString().slice(0, 10));
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setSelectedArticle(art);
    setTitle(art.title || '');
    setSlug(art.slug || '');
    setCategory(art.category || 'Press Release');
    setAuthor(art.author || 'Admin');
    setSummary(art.summary || '');
    setContent(art.content || '');
    setFeaturedImage(art.featured_image || '');
    setPublishDate(art.publish_date || '');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        category,
        author,
        summary,
        content,
        featured_image: featuredImage,
        publish_date: publishDate
      };

      let res;
      if (selectedArticle) {
        payload.id = selectedArticle.id;
        res = await api.post('/news.php?action=edit', payload);
      } else {
        res = await api.post('/news.php?action=add', payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchArticles();
      }
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await api.post('/news.php?action=delete', { id });
      if (res.success) {
        fetchArticles();
      }
    } catch (err) {
      // Handled
    }
  };

  const autoGenerateSlug = (titleText) => {
    setTitle(titleText);
    const generated = titleText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generated);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography>Loading articles...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Publish press releases, schedule changes, welfare reports, and news blogs.
        </Typography>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddModal}>
          Write Article
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Table aria-label="news articles table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Featured Image</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Article Title</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Slug</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((art) => (
              <TableRow key={art.id}>
                <TableCell sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {new Date(art.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={art.featured_image}
                    alt={art.title}
                    sx={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=150';
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{art.title}</TableCell>
                <TableCell>{art.category}</TableCell>
                <TableCell>{art.author}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{art.slug}</TableCell>
                <TableCell>
                  <IconButton color="primary" size="small" onClick={() => openEditModal(art)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(art.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No articles registered.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Article Form Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedArticle ? 'Edit Blog Article' : 'Write New Blog Article'}
          maxWidth="sm"
        >
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              label="Article Title" 
              required 
              fullWidth 
              value={title}
              onChange={(e) => autoGenerateSlug(e.target.value)}
            />
            <TextField 
              label="URL Slug (Auto generated)" 
              required 
              fullWidth 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Category" 
                  select
                  required 
                  fullWidth 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="Press Release">Press Release</MenuItem>
                  <MenuItem value="Community Activity">Community Activity</MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Cultural">Cultural</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Author Display Name" 
                  required 
                  fullWidth 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Grid>
            </Grid>
            <TextField 
              label="Featured Image URL" 
              required 
              fullWidth 
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
            />
            <TextField 
              label="Publish Date" 
              type="date"
              required 
              fullWidth 
              InputLabelProps={{ shrink: true }}
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
            <TextField 
              label="Short Summary" 
              required 
              multiline 
              rows={2}
              fullWidth 
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <TextField 
              label="Article Body (HTML Supported)" 
              required 
              multiline 
              rows={8}
              fullWidth 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button onClick={() => setModalOpen(false)} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button type="submit" variant="contained" fullWidth disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Article'}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default NewsAdmin;
