import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Typography, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Phone, Mail, MapPin } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { PrimaryButton } from '../../components/common/Buttons';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';

const Contact = () => {
  const { settings, trackVisit } = useConfig();
  const [seo, setSeo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load Page SEO
  useEffect(() => {
    trackVisit();
    const fetchSeo = async () => {
      try {
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'contact' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }
      } catch (err) {
        // silent fail
      }
    };
    fetchSeo();
  }, []);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/contact.php?action=send', {
        name: data.name,
        email: data.email,
        subject: `${data.subject} (Phone: ${data.phone})`,
        message: data.message
      });
      if (res.success) {
        reset();
      }
    } catch (err) {
      // Handled by axios interceptor toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "Contact Us & Offices"}
        description={seo?.meta_description || "Get coordinates of the Vikrin Welfare Trust office. Send inquiries about volunteering, registrations, and partnerships."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
      />
      <PageHeader
        title="Contact Us"
        subtitle="We're here to help. Reach out to our trustees and coordinators."
      />

      <SectionWrapper bg="paper">
        <Grid container spacing={5}>
          {/* Column 1: Info Cards */}
          <Grid item xs={12} md={5}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: '1.75rem' }}>
              Our Office Coordinates
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.65 }}>
              For legal trust disclosures, account audits, and media inquiries, visit our central office or reach us on call.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 124, 0, 0.08)', color: 'primary.main', height: 'fit-content' }}>
                  <MapPin size={22} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Head Office Address</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                    {settings?.contact_address || "102, Vikrin Plaza, Central Circle, Mumbai - 400001, Maharashtra, India."}
                  </Typography>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 124, 0, 0.08)', color: 'primary.main', height: 'fit-content' }}>
                  <Phone size={22} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Call Desk</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {settings?.contact_phone || "Helpline: +91 98765 43210"}
                  </Typography>
                </Box>
              </Paper>

              <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', display: 'flex', gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245, 124, 0, 0.08)', color: 'primary.main', height: 'fit-content' }}>
                  <Mail size={22} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Email Support</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {settings?.contact_email || "support@vikrin.org"}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Column 2: Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: '1.25rem' }}>
                Leave a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Fill out the details below. Our community lead will reply to your query.
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          type="email"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="phone"
                      control={control}
                      rules={{ 
                        required: 'Phone is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone (10 digits)' }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          fullWidth
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: 'Subject is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Subject"
                      fullWidth
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
                    />
                  )}
                />

                <Controller
                  name="message"
                  control={control}
                  rules={{ required: 'Message body is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Your Message"
                      multiline
                      rows={5}
                      fullWidth
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  )}
                />

                <PrimaryButton type="submit" size="large" sx={{ py: 1.5, mt: 1 }} disabled={submitting}>
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </PrimaryButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Embedded Map Section */}
      {settings?.google_map_iframe && (
        <Box sx={{ width: '100%', height: 400, borderTop: 1, borderColor: 'divider' }}>
          <iframe
            title="Google Map Office Location"
            src={settings.google_map_iframe}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </Box>
      )}
    </Box>
  );
};

export default Contact;
