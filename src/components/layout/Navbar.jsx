import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Container, Button, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, X, Heart } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../constants/navigation';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close drawer on link click
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const activeStyle = ({ isActive }) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: isActive ? 700 : 500,
    textDecoration: 'none',
    position: 'relative',
    fontSize: '0.925rem',
    transition: 'color 0.2s ease',
  });

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled 
            ? (theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(17, 27, 53, 0.92)')
            : 'transparent',
          borderBottom: scrolled ? '1px solid' : 'none',
          borderColor: 'divider',
          boxShadow: scrolled ? theme.shadows[2] : 'none',
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1440px !important',
            width: '100%',
            mx: 'auto',
            px: { xs: '24px', sm: '24px', md: '24px', lg: '24px', xl: '24px' },
          }}
        >
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: { xs: 70, md: 80 } }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: scrolled || theme.palette.mode === 'dark' ? 'text.primary' : '#FFFFFF',
                textDecoration: 'none',
                letterSpacing: -0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 1, 
                  backgroundColor: 'primary.main', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 900
                }}
              >
                V
              </Box>
              VIKRIN HUB
            </Typography>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3.5 }}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    style={({ isActive }) => ({
                      color: isActive 
                        ? theme.palette.primary.main 
                        : (scrolled || theme.palette.mode === 'dark' ? theme.palette.text.primary : '#F8FAFC'),
                      fontWeight: isActive ? 700 : 500,
                      textDecoration: 'none',
                      position: 'relative',
                      fontSize: '0.925rem',
                      transition: 'color 0.2s ease',
                    })}
                  >
                    {({ isActive }) => (
                      <Box sx={{ position: 'relative', py: 1 }}>
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 3,
                              borderRadius: 2,
                              background: theme.palette.primary.main,
                            }}
                          />
                        )}
                      </Box>
                    )}
                  </NavLink>
                ))}
              </Box>
            )}

            {/* CTA Donate button / Mobile Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isMobile && (
                <Button
                  component={Link}
                  to="/volunteer?action=donate"
                  variant="contained"
                  color="primary"
                  startIcon={<Heart size={16} fill="currentColor" />}
                  sx={{
                    borderRadius: 2.5,
                    px: 3,
                    boxShadow: (theme) => `0 4px 14px 0 ${theme.palette.primary.main}3A`,
                  }}
                >
                  Donate
                </Button>
              )}

              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: scrolled || theme.palette.mode === 'dark' ? 'text.primary' : '#FFFFFF',
                    p: 1 
                  }}
                >
                  <MenuIcon size={24} />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: theme.palette.background.default,
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            VIKRIN HUB
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'text.secondary' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <List disablePadding>
          {navLinks.map((link) => (
            <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={link.path}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  '&.active': {
                    backgroundColor: 'rgba(245, 124, 0, 0.08)',
                    color: 'primary.main',
                    fontWeight: 700,
                  }
                }}
              >
                <ListItemText>
                  <Typography sx={{ fontWeight: 'inherit', fontSize: '1rem' }}>
                    {link.label}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 3 }}>
            <Button
              component={Link}
              to="/volunteer?action=donate"
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<Heart size={16} fill="currentColor" />}
              sx={{ borderRadius: 2.5, py: 1.5 }}
            >
              Donate
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
