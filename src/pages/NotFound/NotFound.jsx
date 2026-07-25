import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import { PrimaryButton } from '../../components/common/Buttons';

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
      }}
    >
      <SEO title="Page Not Found" description="The requested community page could not be found." />
      
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 2.5,
              borderRadius: '50%',
              bgcolor: 'rgba(245, 124, 0, 0.08)',
              color: 'primary.main',
              mb: 3,
            }}
          >
            <AlertCircle size={48} />
          </Box>

          <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '4rem', color: 'primary.main', mb: 1 }}>
            404
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: '1.5rem' }}>
            Page Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>

          <PrimaryButton to="/" startIcon={<ArrowLeft size={16} />} fullWidth>
            Go Back Home
          </PrimaryButton>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotFound;
