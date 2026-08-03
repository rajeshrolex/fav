import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, Paper, TextField, IconButton, Stack, Divider } from '@mui/material';
import { Upload, Trash2, FolderPlus, Copy, Search, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MediaManager = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('');
  
  const [newFolderName, setNewFolderName] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get('/media.php', { params: { folder: currentFolder } });
      if (res.success && res.data) {
        setFiles(res.data.files || []);
        setFolders(res.data.directories || []);
      }
    } catch (err) {
      console.error('Failed to load media files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [currentFolder]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName) return;
    try {
      const res = await api.post('/media.php?action=create_folder', {
        folder: currentFolder,
        name: newFolderName
      });
      if (res.success) {
        setNewFolderName('');
        fetchMedia();
      }
    } catch (err) {
      // Handled
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', currentFolder);

    try {
      const res = await api.post('/media.php?action=upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        fetchMedia();
      }
    } catch (err) {
      // Handled
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"? This action is irreversible.`)) return;
    try {
      const res = await api.post('/media.php?action=delete', {
        folder: currentFolder,
        filename: filename
      });
      if (res.success) {
        fetchMedia();
      }
    } catch (err) {
      // Handled
    }
  };

  const handleCopyLink = (url) => {
    // Resolve absolute URL
    const fullUrl = url.startsWith('http') ? url : `http://127.0.0.1:8000/${url.replace(/^\//, '')}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('File link copied to clipboard!');
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 3, justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Navigation Breadcrumb */}
        <Box>
          <Typography variant="body2" color="text.secondary">
            Current Path: <ChipLabel currentFolder={currentFolder} onClick={setCurrentFolder} />
          </Typography>
        </Box>

        {/* Action Controls */}
        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Search media files..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search size={16} style={{ marginRight: 8, opacity: 0.7 }} />
            }}
          />
          
          <Button
            variant="contained"
            component="label"
            startIcon={<Upload size={16} />}
            disabled={uploading}
          >
            {uploading ? 'Compressing...' : 'Upload Image'}
            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
          </Button>
        </Stack>
      </Box>

      {/* CREATE FOLDER PAPER */}
      <Paper sx={{ p: 2, mb: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>New Directory:</Typography>
        <Box component="form" onSubmit={handleCreateFolder} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Folder name..."
            size="small"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button variant="outlined" startIcon={<FolderPlus size={16} />} type="submit">
            Create
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Typography sx={{ textAlign: 'center', py: 5 }}>Scanning directory...</Typography>
      ) : (
        <Grid container spacing={3.5}>
          {/* Folders grid */}
          {folders.map((f, idx) => (
            <Grid item xs={6} sm={4} md={2.5} key={`folder-${idx}`}>
              <Paper 
                onClick={() => setCurrentFolder(currentFolder ? `${currentFolder}/${f}` : f)}
                sx={{ 
                  p: 2, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  boxShadow: 'none', 
                  cursor: 'pointer',
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <FolderIcon />
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }} noWrap>{f}</Typography>
              </Paper>
            </Grid>
          ))}

          {/* Files grid */}
          {filteredFiles.map((file, idx) => (
            <Grid item xs={12} sm={6} md={3} key={`file-${idx}`}>
              <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://127.0.0.1:8000/${file.url.replace(/^\//, '')}`}
                  alt={file.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=300';
                  }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }} noWrap>{file.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    Size: {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <IconButton size="small" color="primary" onClick={() => handleCopyLink(file.url)}>
                      <Copy size={15} />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" component="a" href={`http://127.0.0.1:8000/${file.url.replace(/^\//, '')}`} target="_blank" color="info">
                        <ExternalLink size={15} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteFile(file.name)}>
                        <Trash2 size={15} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && folders.length === 0 && filteredFiles.length === 0 && (
        <Paper sx={{ p: 5, textAlign: 'center', border: '1px dotted', borderColor: 'divider' }}>
          <Typography color="text.secondary">This directory is empty.</Typography>
        </Paper>
      )}
    </Box>
  );
};

// Breadcrumb builder helper
const ChipLabel = ({ currentFolder, onClick }) => {
  if (!currentFolder) return <span style={{ fontWeight: 700, color: 'orange' }}>/root</span>;
  const parts = currentFolder.split('/');
  return (
    <span>
      <Button variant="text" size="small" sx={{ p: 0, minWidth: 0, fontWeight: 700 }} onClick={() => onClick('')}>root</Button>
      {parts.map((p, idx) => {
        const pathTillNow = parts.slice(0, idx + 1).join('/');
        return (
          <span key={idx}>
            {' / '}
            <Button variant="text" size="small" sx={{ p: 0, minWidth: 0, fontWeight: 700 }} onClick={() => onClick(pathTillNow)}>{p}</Button>
          </span>
        );
      })}
    </span>
  );
};

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

export default MediaManager;
