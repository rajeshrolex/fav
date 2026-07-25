export const components = (palette) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 600,
        padding: '8px 20px',
        boxShadow: 'none',
        textTransform: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(245, 124, 0, 0.15)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
        color: palette.primary.contrastText,
        '&:hover': {
          background: `linear-gradient(135deg, ${palette.primary.dark} 0%, ${palette.primary.main} 100%)`,
          boxShadow: `0 4px 14px 0 rgba(${palette.primary.main === '#F57C00' ? '245, 124, 0' : '251, 146, 60'}, 0.4)`,
        },
      },
      outlinedPrimary: {
        border: `1.5px solid ${palette.primary.main}`,
        color: palette.primary.main,
        '&:hover': {
          border: `1.5px solid ${palette.primary.dark}`,
          backgroundColor: `${palette.primary.main}0A`,
        },
      },
      containedSecondary: {
        backgroundColor: palette.secondary.main,
        color: palette.secondary.contrastText,
        '&:hover': {
          backgroundColor: palette.secondary.dark,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: palette.mode === 'light' 
          ? '0px 8px 30px rgba(226, 232, 240, 0.4)' 
          : '0px 8px 30px rgba(2, 6, 23, 0.6)',
        backgroundImage: 'none',
        border: `1px solid ${palette.divider}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: palette.mode === 'light' 
            ? '0px 12px 36px rgba(148, 163, 184, 0.3)' 
            : '0px 12px 36px rgba(2, 6, 23, 0.8)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: palette.mode === 'light' 
          ? '0px 2px 8px rgba(0, 0, 0, 0.04)' 
          : '0px 2px 8px rgba(0, 0, 0, 0.2)',
      },
      elevation2: {
        boxShadow: palette.mode === 'light' 
          ? '0px 4px 16px rgba(0, 0, 0, 0.06)' 
          : '0px 4px 16px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${palette.divider}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.primary.main,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 1.5,
          borderColor: palette.primary.main,
        },
      },
      notchedOutline: {
        borderColor: palette.divider,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      separator: {
        color: palette.text.disabled,
      },
    },
  },
});
