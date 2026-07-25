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
    fontWeight: 700,
    fontSize: '3rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    '@media (max-width:600px)': {
      fontSize: '2.25rem',
    },
  },
  h2: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 700,
    fontSize: '2.25rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    '@media (max-width:600px)': {
      fontSize: '1.75rem',
    },
  },
  h3: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.35,
    '@media (max-width:600px)': {
      fontSize: '1.4rem',
    },
  },
  h4: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.25rem',
    },
  },
  h5: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.4,
    '@media (max-width:600px)': {
      fontSize: '1.1rem',
    },
  },
  h6: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    fontWeight: 500,
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
