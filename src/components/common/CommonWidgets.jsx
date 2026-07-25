import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, Button, Typography, Pagination, Skeleton, Grid, Zoom, Fab, Card, CardContent } from '@mui/material';
import { Search, Inbox, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. SearchBar Component
export const SearchBar = ({ onSearch, placeholder = 'Search events, news, gallery...', sx = {} }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ width: '100%', maxWidth: 500, ...sx }}>
      <TextField
        fullWidth
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} color="rgba(148, 163, 184, 0.8)" />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: (theme) => theme.palette.mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
            boxShadow: '0 4px 16px 0 rgba(148, 163, 184, 0.08)',
          }
        }}
      />
    </Box>
  );
};

// 2. EmptyState Component
export const EmptyState = ({ title = 'No results found', message = 'Try expanding your search query or check back later.', actionLabel, onActionClick }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 8, px: 2 }}>
      <Box sx={{ p: 2.5, borderRadius: '50%', backgroundColor: 'action.hover', mb: 2, display: 'inline-flex', color: 'text.disabled' }}>
        <Inbox size={40} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 1 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>{message}</Typography>
      {actionLabel && (
        <Button variant="outlined" color="primary" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

// 3. Pagination Component
export const PaginationComponent = ({ count, page, onChange, sx = {} }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, ...sx }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        shape="rounded"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 650,
            borderRadius: 2,
          }
        }}
      />
    </Box>
  );
};

// 4. LoadingSkeleton Component
export const LoadingSkeleton = ({ variant = 'card', count = 3 }) => {
  return (
    <Grid container spacing={4}>
      {Array(count).fill(0).map((_, idx) => (
        <Grid item xs={12} sm={variant === 'card' ? 6 : 12} md={variant === 'card' ? 4 : 12} key={idx}>
          {variant === 'card' ? (
            <Card sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" height={200} animation="wave" />
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1.5 }} />
                <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Skeleton variant="rectangular" width={220} height={140} sx={{ borderRadius: 3, flexShrink: 0 }} />
              <Box sx={{ flexGrow: 1, py: 1 }}>
                <Skeleton variant="text" width="20%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="85%" />
              </Box>
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

// 5. ScrollToTop Component
export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={visible}>
      <Fab
        onClick={scrollToTop}
        color="primary"
        size="medium"
        aria-label="scroll back to top"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: (theme) => `0 6px 20px ${theme.palette.primary.main}4A`,
        }}
      >
        <ChevronUp size={24} />
      </Fab>
    </Zoom>
  );
};

// 6. LoadingScreen Component
export const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
          boxShadow: '0 8px 24px rgba(245, 124, 0, 0.4)',
          marginBottom: 24,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          color: 'text.secondary',
          animation: 'pulse 1.5s infinite ease-in-out',
        }}
      >
        VIKRIN HUB
      </Typography>
    </Box>
  );
};
