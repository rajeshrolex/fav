import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MotionButton = motion.create(Button);

export const PrimaryButton = ({ children, to, onClick, type = 'button', size = 'medium', startIcon, endIcon, fullWidth = false, sx = {}, ...props }) => {
  const componentProps = to ? { component: Link, to } : {};

  return (
    <MotionButton
      type={type}
      variant="contained"
      color="primary"
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      sx={{
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2.5,
        px: size === 'large' ? 4 : size === 'small' ? 2 : 3,
        py: size === 'large' ? 1.5 : size === 'small' ? 0.75 : 1,
        ...sx,
      }}
      {...componentProps}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export const SecondaryButton = ({ children, to, onClick, type = 'button', size = 'medium', startIcon, endIcon, fullWidth = false, sx = {}, ...props }) => {
  const componentProps = to ? { component: Link, to } : {};

  return (
    <MotionButton
      type={type}
      variant="outlined"
      color="primary"
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      sx={{
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2.5,
        borderWidth: 1.5,
        px: size === 'large' ? 4 : size === 'small' ? 2 : 3,
        py: size === 'large' ? 1.5 : size === 'small' ? 0.75 : 1,
        '&:hover': {
          borderWidth: 1.5,
        },
        ...sx,
      }}
      {...componentProps}
      {...props}
    >
      {children}
    </MotionButton>
  );
};
