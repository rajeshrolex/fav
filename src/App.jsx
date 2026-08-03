import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { getTheme } from './theme';
import Router from './routes';

import { useConfig } from './context/ConfigContext';

function App() {
  const { settings, loading } = useConfig();

  // Extract theme settings or use defaults
  const mode = settings?.theme_mode || 'light';
  const primaryColor = settings?.theme_primary || null;
  const secondaryColor = settings?.theme_secondary || null;

  const theme = getTheme(mode, primaryColor, secondaryColor);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0F172A', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
        <h3>Loading Vikrin Community Hub...</h3>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: mode === 'light' ? '#FFFFFF' : '#111B35',
              color: mode === 'light' ? '#0F172A' : '#F8FAFC',
              borderRadius: '8px',
              fontWeight: 600,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }
          }}
        />
        <Router />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
