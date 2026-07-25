import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, useTheme } from '@mui/material';
import { LayoutDashboard, Calendar, Users, Heart, Shield, Settings, ArrowLeft, Menu, LogOut } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const adminMenu = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Events Registry', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Volunteer Roster', path: '/admin/volunteers', icon: <Users size={20} /> },
    { label: 'Donation Ledgers', path: '/admin/donations', icon: <Heart size={20} /> },
    { label: 'Sponsors Board', path: '/admin/sponsors', icon: <Shield size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
          V
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          VIKRIN ADMIN
        </Typography>
      </Toolbar>
      <Divider />
      
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {adminMenu.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(245, 124, 0, 0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.label}
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton component={Link} to="/" sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <ArrowLeft size={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Exit to Website
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 2, color: 'error.main' }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'inherit' }}>
                Log Out
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <Menu size={20} />
          </IconButton>
          
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {adminMenu.find(item => item.path === location.pathname)?.label || 'Overview'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Aishwarya D.</Typography>
              <Typography variant="caption" color="text.secondary">Super Administrator</Typography>
            </Box>
            <Avatar src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150" alt="Admin Profile" />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 1, borderColor: 'divider' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Pane */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          pt: { xs: 11, sm: 12 }, // offset height of app bar
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
