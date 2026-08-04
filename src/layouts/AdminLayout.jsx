import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, useTheme } from '@mui/material';
import { 
  LayoutDashboard, Calendar, Users, Heart, Shield, Settings, ArrowLeft, Menu, LogOut, 
  Home, Info, Clock, Image, FileText, Mail, FolderOpen, Sun, Moon 
} from 'lucide-react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const { settings, updateSettings } = useConfig();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleThemeMode = async () => {
    const currentMode = settings?.theme_mode || 'light';
    const nextMode = currentMode === 'light' ? 'dark' : 'light';
    await updateSettings({ ...settings, theme_mode: nextMode });
  };

  // Guard: if not authenticated and not loading, redirect to login page
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
        <Typography>Checking authorization status...</Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Full route map for page title lookup
  const allRoutes = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Hero & Home CMS', path: '/admin/home' },
    { label: 'About CMS', path: '/admin/about' },
    { label: 'Committee Roster', path: '/admin/committee' },
    { label: 'Festival History', path: '/admin/festival-history' },
    { label: 'Events Registry', path: '/admin/events' },
    { label: 'Gallery Albums', path: '/admin/gallery' },
    { label: 'Sponsors Board', path: '/admin/sponsors' },
    { label: 'Volunteers Inbox', path: '/admin/volunteers' },
    { label: 'Contact Messages', path: '/admin/messages' },
    { label: 'News Editor', path: '/admin/news' },
    { label: 'Media Explorer', path: '/admin/media' },
    { label: 'Website Settings & SEO', path: '/admin/settings' },
  ];

  const adminMenu = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Hero & Home CMS', path: '/admin/home', icon: <Home size={20} /> },
    { label: 'About CMS', path: '/admin/about', icon: <Info size={20} /> },
    { label: 'Committee Roster', path: '/admin/committee', icon: <Users size={20} /> },
    { label: 'Festival History', path: '/admin/festival-history', icon: <Clock size={20} /> },
    { label: 'Events Registry', path: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Gallery Albums', path: '/admin/gallery', icon: <Image size={20} /> },
    { label: 'Sponsors Board', path: '/admin/sponsors', icon: <Shield size={20} /> },
    { label: 'Volunteers Inbox', path: '/admin/volunteers', icon: <Heart size={20} /> },
    { label: 'Contact Messages', path: '/admin/messages', icon: <Mail size={20} /> },
    { label: 'News Editor', path: '/admin/news', icon: <FileText size={20} /> },
    { label: 'Media Explorer', path: '/admin/media', icon: <FolderOpen size={20} /> },
    { label: 'Website Settings & SEO', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: 1, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>
          V
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          VIKRIN CMS
        </Typography>
      </Toolbar>
      <Divider />
      
      <List sx={{ px: 2, py: 1, flexGrow: 1, overflowY: 'auto' }}>
        {adminMenu.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
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
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {item.label}
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {/* Theme mode switcher */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton onClick={toggleThemeMode} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              {settings?.theme_mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {settings?.theme_mode === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton component={Link} to="/" sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
              <ArrowLeft size={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                Exit to Website
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: 'error.main' }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogOut size={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'inherit' }}>
                Log Out
              </Typography>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const activeTitle = allRoutes.find(item => item.path === location.pathname)?.label || 'Admin Panel';

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
          zIndex: (theme) => theme.zIndex.drawer + 1
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
            {activeTitle}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user.username}</Typography>
              <Typography variant="caption" color="text.secondary">{user.role}</Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
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
