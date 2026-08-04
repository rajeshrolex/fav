import React from 'react';
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Divider, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { footerLinks } from '../../constants/navigation';

// Social media SVG components for reliable bundling
const Facebook = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 18} height={props.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Footer = () => {
  const theme = useTheme();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'light' ? '#0F172A' : '#070C19',
        color: 'rgba(255, 255, 255, 0.8)',
        pt: 8,
        pb: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Column 1: Brand & Contact Info */}
          <Grid xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#FFFFFF',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box 
                sx={{ 
                  width: 30, 
                  height: 30, 
                  borderRadius: 1, 
                  backgroundColor: 'primary.main', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#FFF',
                  fontWeight: 900,
                  fontSize: '1rem',
                }}
              >
                V
              </Box>
              VIKRIN HUB
            </Typography>
            <Typography variant="body2" sx={{ mb: 3.5, lineHeight: 1.6, color: 'rgba(248, 250, 252, 0.7)' }}>
              A premium digitalization initiative by Vikrin Community Welfare Trust. Empowering culture, youth associations, festivals, and local NGOs with modern online registries and resource pipelines.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MapPin size={18} className="text-orange-500" style={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                  102, Vikrin Plaza, Central Circle, Mumbai - 400001
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone size={18} style={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                  +91 22 2456 7890
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Mail size={18} style={{ color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ color: 'rgba(248, 250, 252, 0.7)' }}>
                  contact@vikrin.org
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Column 2: Sitemap & Legal */}
          <Grid xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3, fontSize: '1rem' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.about.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  sx={{
                    color: 'rgba(248, 250, 252, 0.65)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>

            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mt: 4, mb: 2, fontSize: '1rem' }}>
              Support & Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.support.map((link) => (
                <Typography
                  key={link.label}
                  component={Link}
                  to={link.path}
                  variant="body2"
                  sx={{
                    color: 'rgba(248, 250, 252, 0.65)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Newsletter Sign-up */}
          <Grid xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3, fontSize: '1rem' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.6, color: 'rgba(248, 250, 252, 0.7)' }}>
              Subscribe to stay updated with regional festival dates, volunteer drives, and announcements.
            </Typography>

            <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                fullWidth
                required
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#FFF',
                    borderRadius: 2,
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                endIcon={<Send size={14} />}
                sx={{ py: 1, borderRadius: 2 }}
              >
                Subscribe
              </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2, fontSize: '0.9rem' }}>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton component="a" href="#" sx={{ color: 'rgba(255, 255, 255, 0.65)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <Facebook size={18} />
                </IconButton>
                <IconButton component="a" href="#" sx={{ color: 'rgba(255, 255, 255, 0.65)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <Twitter size={18} />
                </IconButton>
                <IconButton component="a" href="#" sx={{ color: 'rgba(255, 255, 255, 0.65)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <Instagram size={18} />
                </IconButton>
                <IconButton component="a" href="#" sx={{ color: 'rgba(255, 255, 255, 0.65)', '&:hover': { color: 'primary.main', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <Youtube size={18} />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Column 4: Google Map Embed */}
          <Grid xs={12} md={3}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3, fontSize: '1rem' }}>
              Our Location
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 180,
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <iframe
                title="Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d120680.125!2d72.825833!3d18.966667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(248, 250, 252, 0.45)' }}>
            &copy; {new Date().getFullYear()} Vikrin Trust. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              component={Link}
              to="/terms"
              variant="caption"
              sx={{ color: 'rgba(248, 250, 252, 0.45)', textDecoration: 'none', '&:hover': { color: '#FFF' } }}
            >
              Terms of Use
            </Typography>
            <Typography
              component={Link}
              to="/privacy"
              variant="caption"
              sx={{ color: 'rgba(248, 250, 252, 0.45)', textDecoration: 'none', '&:hover': { color: '#FFF' } }}
            >
              Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
