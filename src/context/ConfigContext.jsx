import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings.php');
      if (res.success && res.data) {
        setSettings(res.data);
        
        // Dynamically set page title and favicon from settings
        if (res.data.site_name) {
          document.title = res.data.site_name;
        }
        if (res.data.favicon_url) {
          const favicon = document.querySelector("link[rel*='icon']");
          if (favicon) {
            favicon.href = res.data.favicon_url;
          }
        }
      }
    } catch (err) {
      console.error('Failed to load site configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    setLoading(true);
    try {
      const res = await api.post('/settings.php', newSettings);
      if (res.success) {
        await fetchSettings(); // reload
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to update settings' };
    } finally {
      setLoading(false);
    }
  };

  // Helper to trigger visit count tracking
  const trackVisit = async () => {
    try {
      // Execute hit API silently
      await api.get('/dashboard.php', { params: { action: 'hit' } });
    } catch (err) {
      // silent fail
    }
  };

  return (
    <ConfigContext.Provider value={{ settings, loading, fetchSettings, updateSettings, trackVisit }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
