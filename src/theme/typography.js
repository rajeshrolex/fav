export const typography = {
  fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
  htmlFontSize: 16,
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    '@media (max-width:768px)': {
      fontSize: '2rem',
    },
  },
  h2: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(1.65rem, 4vw, 2.5rem)',
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
    '@media (max-width:768px)': {
      fontSize: '1.65rem',
    },
  },
  h3: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
    lineHeight: 1.3,
    '@media (max-width:768px)': {
      fontSize: '1.35rem',
    },
  },
  h4: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 650,
    fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
    lineHeight: 1.35,
    '@media (max-width:768px)': {
      fontSize: '1.15rem',
    },
  },
  h5: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    lineHeight: 1.4,
    '@media (max-width:768px)': {
      fontSize: '1rem',
    },
  },
  h6: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.45,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.57,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    lineHeight: 1.75,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    lineHeight: 2.66,
    textTransform: 'uppercase',
  },
};
