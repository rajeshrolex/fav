import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, TextField, MenuItem, Typography, Paper, Grid, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Heart, UserCheck, ShieldCheck } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { PrimaryButton } from '../../components/common/Buttons';
import { volunteerRoles } from '../../constants/mockData';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import toast from 'react-hot-toast';

const Volunteer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  const [donationAmount, setDonationAmount] = useState('1000');
  
  const { trackVisit } = useConfig();
  const [seo, setSeo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle syncing URL query `?action=donate` to Tab
  useEffect(() => {
    trackVisit();
    
    // Fetch SEO
    const fetchSeo = async () => {
      try {
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'volunteer' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }
      } catch (err) {
        // silent fail
      }
    };
    fetchSeo();

    const action = searchParams.get('action');
    if (action === 'donate') {
      setTabValue(1);
    } else {
      setTabValue(0);
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      setSearchParams({ action: 'donate' });
    } else {
      setSearchParams({});
    }
  };

  // React Hook Form for Volunteer
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: '',
      experience: '',
      message: '',
    }
  });

  const onVolunteerSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await api.post('/volunteers.php?action=register', {
        name: data.fullName,
        email: data.email,
        mobile: data.phone,
        address: `Prior Experience: ${data.experience}. Skills details: ${data.message}`,
        skills: data.role
      });
      if (res.success) {
        reset();
      }
    } catch (err) {
      // Toast handles error automatically via axios interceptor
    } finally {
      setSubmitting(false);
    }
  };

  // Donation Form Submit
  const handleDonationSubmit = (e) => {
    e.preventDefault();
    toast.success(`Thank you for your generous contribution of ₹${donationAmount}! A receipt and tax exemption certificate (80G) have been sent.`, {
      duration: 6000,
      icon: '❤️',
    });
  };

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "Become a Volunteer"}
        description={seo?.meta_description || "Become a community volunteer or donate securely to support cultural festivals, relief work, and educational camps."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
      />
      <PageHeader
        title="Support Our Cause"
        subtitle="Give your time or secure contributions to fuel community progress."
      />

      <SectionWrapper bg="paper">
        {/* Toggle Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 5, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="support tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '1rem',
                pb: 1.5,
              }
            }}
          >
            <Tab icon={<UserCheck size={18} />} iconPosition="start" label="Register as Volunteer" />
            <Tab icon={<Heart size={18} />} iconPosition="start" label="Make a Donation" />
          </Tabs>
        </Box>

        {/* Tab 1: Volunteer registration form */}
        {tabValue === 0 && (
          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: '1.25rem' }}>
                  Volunteer Registration Form
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Fill out the form below. Once approved, you will receive invitation updates on emergency tasks or event setups.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onVolunteerSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: 'Full Name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
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
                          required: 'Phone number is required',
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
                    name="role"
                    control={control}
                    rules={{ required: 'Please select a preferred role' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Primary Area of Interest"
                        fullWidth
                        error={!!errors.role}
                        helperText={errors.role?.message}
                      >
                        {volunteerRoles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Controller
                    name="experience"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Prior Volunteering Experience"
                        fullWidth
                      >
                        <MenuItem value="none">None / First time</MenuItem>
                        <MenuItem value="1-year">Less than 1 year</MenuItem>
                        <MenuItem value="1-3-years">1 to 3 years</MenuItem>
                        <MenuItem value="3-plus">More than 3 years</MenuItem>
                      </TextField>
                    )}
                  />

                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Skills or Specific Interests (Optional)"
                        multiline
                        rows={3}
                        fullWidth
                      />
                    )}
                  />

                  <PrimaryButton type="submit" size="large" sx={{ py: 1.5, mt: 1 }} disabled={submitting}>
                    {submitting ? 'Submitting Application...' : 'Register Application'}
                  </PrimaryButton>
                </Box>
              </Paper>
            </Grid>

            {/* Support notes */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldCheck size={20} className="text-orange-500" /> Volunteer Guidelines
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
                    All volunteers are provided with an official ID card and custom Vikrin Trust t-shirts for crowd control duties.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    Certificate of Appreciation and performance recommendation letter is provided to students on completing at least 40 hours of calendar assistance.
                  </Typography>
                </Paper>
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Need Immediate Help?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                    If you are inquiring about corporate social responsibility (CSR) volunteer days or group bookings:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Email: volunteer-coordinator@vikrin.org
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Donation workflow */}
        {tabValue === 1 && (
          <Grid container spacing={5}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: '1.25rem' }}>
                  Secure Donation Form
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Select a preset amount or enter a custom sum. All funds are backed by tax-exemption receipts (Section 80G).
                </Typography>

                <Box component="form" onSubmit={handleDonationSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                  {/* Preset Buttons */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Select Amount (INR)</Typography>
                    <Grid container spacing={2}>
                      {['500', '1000', '2500', '5000', '10000'].map((amt) => (
                        <Grid item xs={4} sm={2.4} key={amt}>
                          <Button
                            fullWidth
                            variant={donationAmount === amt ? 'contained' : 'outlined'}
                            onClick={() => setDonationAmount(amt)}
                            sx={{ py: 1, borderRadius: 2, fontWeight: 700 }}
                          >
                            ₹{amt}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Custom input */}
                  <TextField
                    label="Custom Donation Amount (₹)"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    type="number"
                    required
                    fullWidth
                    InputProps={{
                      inputProps: { min: 100 }
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField label="Donor Full Name" required fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField label="PAN Number (For tax benefit)" required fullWidth />
                    </Grid>
                  </Grid>

                  <TextField label="Email Address (To receive PDF receipt)" required type="email" fullWidth />

                  <PrimaryButton type="submit" size="large" sx={{ py: 1.5, mt: 1 }}>
                    Proceed to Payment (Mock)
                  </PrimaryButton>
                </Box>
              </Paper>
            </Grid>

            {/* Donation transparency info */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Heart size={20} className="text-red-500" /> Donation Transparency
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
                    Every rupee donated is subject to strict financial auditing. We publish half-yearly reports detailing receipts and expenses, downloadable from our trust archive.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    You can designate your funds for specific sectors (e.g., medical kits or school book supply) by leaving details in the contact form.
                  </Typography>
                </Paper>

                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Section 80G Certificate
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    Vikrin Welfare Trust is registered under section 12A and 80G of the Income Tax Act. Indian donors can claim 50% deduction of their contributions.
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default Volunteer;
