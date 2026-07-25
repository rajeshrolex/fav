import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, badge, align = 'center', sx = {} }) => {
  const isCenter = align === 'center';

  return (
    <Box 
      sx={{ 
        mb: { xs: 4, md: 6 }, 
        textAlign: align,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCenter ? 'center' : 'flex-start',
        ...sx 
      }}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{
              fontWeight: 700,
              letterSpacing: 1.5,
              mb: 1,
              display: 'inline-block',
              px: 2,
              py: 0.5,
              borderRadius: 5,
              backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(245, 124, 0, 0.08)' : 'rgba(251, 146, 60, 0.15)',
              border: '1px solid',
              borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(245, 124, 0, 0.15)' : 'rgba(251, 146, 60, 0.3)',
            }}
          >
            {badge}
          </Typography>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            position: 'relative',
            pb: 2,
            mb: subtitle ? 2 : 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: isCenter ? '50%' : 0,
              transform: isCenter ? 'translateX(-50%)' : 'none',
              width: 60,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'primary.main',
              backgroundImage: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            }
          }}
        >
          {title}
        </Typography>
      </motion.div>

      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: isCenter ? 'auto' : 0,
              fontWeight: 450,
            }}
          >
            {subtitle}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default SectionTitle;
