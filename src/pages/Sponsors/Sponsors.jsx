import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, TextField, useTheme } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { SponsorCard } from '../../components/cards/Cards';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import SectionTitle from '../../components/common/SectionTitle';
import { PrimaryButton } from '../../components/common/Buttons';
import { Modal } from '../../components/common/Modals';
import toast from 'react-hot-toast';

const Sponsors = () => {
  const theme = useTheme();
  const { trackVisit } = useConfig();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [sponsorsList, setSponsorsList] = useState([]);
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Partnership form states
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetTier, setTargetTier] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    trackVisit();
    const fetchSponsors = async () => {
      try {
        // Load Page SEO
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'sponsors' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }

        // Load Sponsors list
        const res = await api.get('/sponsors.php');
        if (res.success && res.data) {
          const mapped = res.data.map(s => ({
            id: s.id,
            name: s.name,
            logo: s.logo_url,
            website: s.website || '#',
            tier: s.category || 'Bronze'
          }));
          setSponsorsList(mapped);
        }
      } catch (err) {
        console.error('Failed to load sponsors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const goldSponsors = sponsorsList.filter(s => s.tier === 'Gold');
  const silverSponsors = sponsorsList.filter(s => s.tier === 'Silver');
  const bronzeSponsors = sponsorsList.filter(s => s.tier === 'Bronze');

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Send partnership request through contact API
      const res = await api.post('/contact.php?action=send', {
        name: contactPerson,
        email: email,
        subject: `Sponsorship Inquiry: ${companyName} (${targetTier} Tier)`,
        message: `Company Name: ${companyName}\nPhone: ${phone}\nTier: ${targetTier}\nDetails: ${details}`
      });
      if (res.success) {
        setIsContactOpen(false);
        // Clear
        setCompanyName('');
        setContactPerson('');
        setEmail('');
        setPhone('');
        setTargetTier('');
        setDetails('');
      }
    } catch (err) {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Typography>Loading partners...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "Trust Sponsors & Partners"}
        description={seo?.meta_description || "Meet the organizations and businesses supporting our social welfare projects. Apply for sponsorship tiers."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
      />
      <PageHeader
        title="Sponsors & Partners"
        subtitle="We express deep gratitude to our corporate partners backing our cultural and social campaigns."
      />

      {/* Gold Tier */}
      {goldSponsors.length > 0 && (
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
      )}

      {/* Silver Tier */}
      {silverSponsors.length > 0 && (
        <SectionWrapper bg="alternate">
          <SectionTitle badge="Growth Partners" title="Silver Sponsors" align="center" />
          <Grid container spacing={3} justifyContent="center">
            {silverSponsors.map(sponsor => (
              <Grid item xs={6} sm={4} md={3} key={sponsor.id}>
                <SponsorCard sponsor={sponsor} />
              </Grid>
            ))}
          </Grid>
        </SectionWrapper>
      )}

      {/* Bronze Tier */}
      {bronzeSponsors.length > 0 && (
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
      )}

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
            <TextField 
              label="Company Name" 
              required 
              fullWidth 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <TextField 
              label="Contact Person" 
              required 
              fullWidth 
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
            <TextField 
              label="Email Address" 
              required 
              type="email" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField 
              label="Phone Number" 
              required 
              fullWidth 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField 
              label="Target Tier (Gold, Silver, Bronze)" 
              required 
              fullWidth 
              value={targetTier}
              onChange={(e) => setTargetTier(e.target.value)}
            />
            <TextField 
              label="Additional Details" 
              multiline 
              rows={3} 
              fullWidth 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <PrimaryButton type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Partnership Inquiry'}
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Sponsors;
