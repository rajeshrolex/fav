import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, useTheme } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { SponsorCard } from '../../components/cards/Cards';
import { sponsors } from '../../constants/mockData';
import SectionTitle from '../../components/common/SectionTitle';
import { PrimaryButton } from '../../components/common/Buttons';
import { Modal } from '../../components/common/Modals';
import toast from 'react-hot-toast';

const Sponsors = () => {
  const theme = useTheme();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const goldSponsors = sponsors.filter(s => s.tier === 'Gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'Silver');
  const bronzeSponsors = sponsors.filter(s => s.tier === 'Bronze');

  const handleSponsorSubmit = (e) => {
    e.preventDefault();
    toast.success('Your sponsorship inquiry has been sent! Our representative will call you.', {
      duration: 5000,
    });
    setIsContactOpen(false);
  };

  return (
    <Box>
      <SEO
        title="Trust Sponsors & Partners"
        description="Meet the organizations and businesses supporting our social welfare projects. Apply for sponsorship tiers."
      />
      <PageHeader
        title="Sponsors & Partners"
        subtitle="We express deep gratitude to our corporate partners backing our cultural and social campaigns."
      />

      {/* Gold Tier */}
      <SectionWrapper bg="paper">
        <SectionTitle badge="Premium Tier" title="Gold Sponsors" align="center" />
        <Grid container spacing={4} justifyContent="center">
          {goldSponsors.map(sponsor => (
            <Grid item xs={12} sm={6} md={3} key={sponsor.id}>
              <SponsorCard sponsor={sponsor} />
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>

      {/* Silver Tier */}
      <SectionWrapper bg="alternate">
        <SectionTitle badge="Growth Partners" title="Silver Sponsors" align="center" />
        <Grid container spacing={3} justifyContent="center">
          {silverSponsors.map(sponsor => (
            <Grid item xs={6} sm={4} md={2.5} key={sponsor.id}>
              <SponsorCard sponsor={sponsor} />
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>

      {/* Bronze Tier */}
      <SectionWrapper bg="paper">
        <SectionTitle badge="Supporter Tier" title="Bronze Sponsors" align="center" />
        <Grid container spacing={2} justifyContent="center">
          {bronzeSponsors.map(sponsor => (
            <Grid item xs={6} sm={3} md={2} key={sponsor.id}>
              <SponsorCard sponsor={sponsor} />
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>

      {/* Join Callout */}
      <SectionWrapper 
        bg="gradient"
        sx={{
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' 
            : 'linear-gradient(135deg, #1A1C30 0%, #121424 100%)',
          textAlign: 'center',
          py: 10,
        }}
      >
        <Box sx={{ maxWidth: 650, mx: 'auto' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2.5 }}>
            Partner With Our Organization
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Align your brand with local community initiatives. Sponsors get prominent logo placement on festival hoardings, platform badges, press materials, and social posts.
          </Typography>
          <PrimaryButton onClick={() => setIsContactOpen(true)}>
            Become a Sponsor
          </PrimaryButton>
        </Box>
      </SectionWrapper>

      {/* Sponsor outreach Modal */}
      {isContactOpen && (
        <Modal
          open={isContactOpen}
          onClose={() => setIsContactOpen(null)}
          title="Sponsorship Partnership Inquiry"
          maxWidth="xs"
        >
          <Box component="form" onSubmit={handleSponsorSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField label="Company Name" required fullWidth />
            <TextField label="Contact Person" required fullWidth />
            <TextField label="Email Address" required type="email" fullWidth />
            <TextField label="Phone Number" required fullWidth />
            <TextField label="Target Tier (Gold, Silver, Bronze)" required fullWidth />
            <TextField label="Additional Details" multiline rows={3} fullWidth />
            <PrimaryButton type="submit" fullWidth>
              Send Partnership Inquiry
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Sponsors;
