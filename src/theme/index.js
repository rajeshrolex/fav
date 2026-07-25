import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';
import { components } from './components';

export const getTheme = (mode = 'light') => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  return createTheme({
    palette,
    typography,
    components: components(palette),
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 1px 3px rgba(0, 0, 0, 0.05)',
      '0px 2px 6px rgba(0, 0, 0, 0.05)',
      '0px 4px 12px rgba(0, 0, 0, 0.05)',
      '0px 8px 24px rgba(0, 0, 0, 0.05)',
      '0px 16px 32px rgba(0, 0, 0, 0.05)',
      // fill remaining with defaults
      ...Array(19).fill('none').map((_, idx) => `0px ${idx + 18}px ${idx + 36}px rgba(0, 0, 0, 0.05)`)
    ]
  });
};
