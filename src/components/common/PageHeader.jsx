import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PageHeader = ({ title, subtitle, backgroundImage }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const defaultBg = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop';
  const bgImg = backgroundImage || defaultBg;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 200, md: 280 },
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFFFFF',
        pt: 8, // space for fixed navbar
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<ChevronRight size={14} color="rgba(255, 255, 255, 0.6)" />}
            aria-label="breadcrumb"
            sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <MuiLink
              component={Link}
              to="/"
              underline="hover"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}
            >
              Home
            </MuiLink>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const label = value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

              return last ? (
                <Typography
                  key={to}
                  color="primary.light"
                  sx={{ fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {title || label}
                </Typography>
              ) : (
                <MuiLink
                  component={Link}
                  to={to}
                  underline="hover"
                  color="inherit"
                  key={to}
                  sx={{ fontSize: '0.85rem' }}
                >
                  {label}
                </MuiLink>
              );
            })}
          </Breadcrumbs>

          {/* Heading */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.25rem', md: '3.25rem' },
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              mb: subtitle ? 1 : 0,
            }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: 600,
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                fontWeight: 400,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PageHeader;
