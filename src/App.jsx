import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { getTheme } from './theme';
import Router from './routes';

function App() {
  // Configured with light mode default, toggle mode state is ready for future dark theme integration
  const [mode, setMode] = useState('light');
  const theme = getTheme(mode);

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
