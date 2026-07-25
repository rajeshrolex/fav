import React from 'react';
import { Box, Typography, Paper, Grid, useTheme, useMediaQuery } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { historyTimeline } from '../../constants/mockData';
import { motion } from 'framer-motion';

const FestivalHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <SEO
        title="Festival Legacy Timeline"
        description="Explore the decades-long journey of the Vikrin Community trust and our grand festival history."
      />
      <PageHeader
        title="Festival History"
        subtitle="A historical retrospective of our legacy, growth, and community impact."
      />

      <SectionWrapper bg="paper">
        <Box sx={{ maxWidth: 850, mx: 'auto', position: 'relative', py: 4 }}>
          {/* Vertical line indicator */}
          {!isMobile && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 3,
                bgcolor: 'divider',
              }}
            />
          )}

          {historyTimeline.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <Grid
                container
                spacing={isMobile ? 2 : 6}
                key={index}
                sx={{
                  mb: { xs: 5, md: 8 },
                  flexDirection: isMobile ? 'column' : isEven ? 'row' : 'row-reverse',
                  position: 'relative',
                }}
              >
                {/* Visual marker node */}
                {!isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: '3px solid',
                      borderColor: 'background.paper',
                      zIndex: 2,
                      boxShadow: (theme) => `0 0 0 4px ${theme.palette.divider}`,
                    }}
                  />
                )}

                {/* Left Side: Content Box */}
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: isMobile ? 0 : isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 'none',
                        position: 'relative',
                        '&::after': !isMobile ? {
                          content: '""',
                          position: 'absolute',
                          top: 28,
                          width: 12,
                          height: 12,
                          transform: 'rotate(45deg)',
                          borderColor: 'divider',
                          backgroundColor: 'background.paper',
                          right: isEven ? -7 : 'auto',
                          left: !isEven ? -7 : 'auto',
                          borderTop: isEven ? '1.5px solid' : 'none',
                          borderRight: isEven ? '1.5px solid' : 'none',
                          borderBottom: !isEven ? '1.5px solid' : 'none',
                          borderLeft: !isEven ? '1.5px solid' : 'none',
                        } : {},
                      }}
                    >
                      <Typography
                        variant="h3"
                        color="primary"
                        sx={{ fontWeight: 800, mb: 1, fontSize: '1.75rem' }}
                      >
                        {item.year}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                        {item.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>

                {/* Right Side: Spacer */}
                <Grid item xs={12} md={6} />
              </Grid>
            );
          })}
        </Box>
      </SectionWrapper>
    </Box>
  );
};

export default FestivalHistory;
