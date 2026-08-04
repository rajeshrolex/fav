import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Avatar, IconButton, Chip, Grid, Paper } from '@mui/material';
import { Calendar, MapPin, Clock, ArrowUpRight, Mail } from 'lucide-react';

// Social SVG components for reliable bundling
const Linkedin = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import { Link } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import { motion } from 'framer-motion';

// Event Card Component
export const EventCard = ({ event }) => {
  const { id, title, date, time, location, category, description, image, status } = event;
  
  // Format Date to friendly form
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0 12px 30px rgba(148, 163, 184, 0.18)' 
            : '0 12px 30px rgba(2, 6, 23, 0.8)',
        }
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.06)',
            }
          }}
        />
        <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1, zIndex: 10 }}>
          <Chip
            label={category}
            size="small"
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#FFFFFF',
              backdropFilter: 'blur(6px)',
              fontWeight: 700,
              fontSize: '0.725rem',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              px: 0.5
            }}
          />
          <Chip
            label={status}
            size="small"
            color={status === 'Upcoming' ? 'primary' : 'default'}
            sx={{ 
              fontWeight: 700,
              fontSize: '0.725rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5, flexGrow: 1 }}>
          <Typography 
            variant="h4" 
            component="h3" 
            sx={{ 
              fontWeight: 800, 
              fontSize: '1.2rem', 
              lineHeight: 1.35, 
              color: 'text.primary',
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6,
              fontSize: '0.875rem'
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, borderTop: '1px solid', borderColor: 'divider', pt: 2.5, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
            <Calendar size={15} style={{ opacity: 0.8 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{formattedDate}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
            <Clock size={15} style={{ opacity: 0.8 }} />
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{time}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
            <MapPin size={15} style={{ opacity: 0.8 }} />
            <Typography variant="body2" noWrap sx={{ width: '100%', fontSize: '0.85rem' }}>{location}</Typography>
          </Box>
        </Box>

        {status === 'Upcoming' ? (
          <PrimaryButton to={`/events?id=${id}`} fullWidth endIcon={<ArrowUpRight size={16} />}>
            Register Now
          </PrimaryButton>
        ) : (
          <SecondaryButton to={`/events?id=${id}`} fullWidth>
            View Details
          </SecondaryButton>
        )}
      </CardContent>
    </Card>
  );
};

// Gallery Card Component
export const GalleryCard = ({ item, onSelect }) => {
  const { title, category, image } = item;
  return (
    <motion.div style={{ width: '100%' }} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Box
        onClick={onSelect}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0px 8px 24px rgba(148, 163, 184, 0.15)' 
            : '0px 8px 24px rgba(2, 6, 23, 0.4)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover .gallery-overlay': { opacity: 1 },
          '&:hover img': { transform: 'scale(1.08)' }
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        <Box
          className="gallery-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            p: 3,
            color: '#FFFFFF'
          }}
        >
          <Chip
            label={category}
            size="small"
            sx={{
              alignSelf: 'start',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              mb: 1,
              fontWeight: 600
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFFFFF' }}>{title}</Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

// Sponsor Card Component
export const SponsorCard = ({ sponsor }) => {
  const { name, tier, logo, website } = sponsor;

  const isGold = tier === 'Gold';
  const isSilver = tier === 'Silver';

  return (
    <motion.div style={{ width: '100%' }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
      <Paper
        component={Link}
        to={website}
        target="_blank"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          width: '100%',
          minHeight: 120,
          borderRadius: 4,
          border: '1px solid',
          borderColor: isGold ? 'primary.light' : 'divider',
          backgroundColor: (theme) => theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.7)' 
            : 'rgba(17, 27, 53, 0.5)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          textDecoration: 'none',
          boxShadow: isGold ? (theme) => `0 4px 20px 0 ${theme.palette.primary.main}14` : 'none',
        }}
      >
        {tier && (
          <Chip
            label={tier}
            size="small"
            color={isGold ? 'primary' : isSilver ? 'secondary' : 'default'}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: '0.65rem',
              fontWeight: 700,
              height: 18,
            }}
          />
        )}
        <Box
          component="img"
          src={logo}
          alt={name}
          sx={{
            width: 'auto',
            maxWidth: '80%',
            maxHeight: 50,
            objectFit: 'contain',
            filter: (theme) => theme.palette.mode === 'light' ? 'grayscale(30%)' : 'grayscale(10%) brightness(1.2)',
            transition: 'filter 0.3s ease',
            '&:hover': {
              filter: 'grayscale(0%)',
            }
          }}
        />
        <Typography
          variant="subtitle2"
          align="center"
          sx={{
            mt: 1.5,
            color: 'text.secondary',
            fontWeight: 650,
            fontSize: '0.85rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {name}
        </Typography>
      </Paper>
    </motion.div>
  );
};

// Committee Card Component
export const CommitteeCard = ({ member }) => {
  const { name, role, department, image, bio, socials } = member;

  return (
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 3, textAlign: 'center', alignItems: 'center' }}>
      <Avatar
        src={image}
        alt={name}
        sx={{
          width: 110,
          height: 110,
          mb: 2,
          border: '3px solid',
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 4px 14px 0 ${theme.palette.primary.main}2A`,
        }}
      />
      <Chip
        label={department}
        size="small"
        sx={{
          mb: 1.5,
          backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.08)',
          color: 'text.secondary',
          fontSize: '0.75rem',
          fontWeight: 600
        }}
      />
      <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.2rem', mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
        {role}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1, px: 1 }}>
        {bio}
      </Typography>
      
      {socials && (
        <Box sx={{ display: 'flex', gap: 1, justifySelf: 'end' }}>
          {socials.email && (
            <IconButton size="small" component="a" href={`mailto:${socials.email}`} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <Mail size={18} />
            </IconButton>
          )}
          {socials.linkedin && (
            <IconButton size="small" component="a" href={socials.linkedin} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <Linkedin size={18} />
            </IconButton>
          )}
          {socials.twitter && (
            <IconButton size="small" component="a" href={socials.twitter} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <Twitter size={18} />
            </IconButton>
          )}
        </Box>
      )}
    </Card>
  );
};
