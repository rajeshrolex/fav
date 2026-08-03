import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, useTheme, Card, CardContent, Avatar } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import SectionTitle from '../../components/common/SectionTitle';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { Target, Heart, Eye, Users, Award, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import { motion } from 'framer-motion';

const About = () => {
  const theme = useTheme();
  const { trackVisit } = useConfig();

  // CMS States
  const [seo, setSeo] = useState(null);
  const [details, setDetails] = useState({});
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackVisit();
    const fetchAboutData = async () => {
      try {
        // Load Page SEO
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'about' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }

        // Load About page details & timeline
        const res = await api.get('/about.php');
        if (res.success && res.data) {
          setDetails(res.data.details);
          setTimeline(res.data.timeline);
        }
      } catch (err) {
        console.error('Failed to fetch about data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const values = [
    { title: 'Cultural Integrity', description: 'Preserving and promoting traditional Indian festivals and folklore in their purest, most vibrant forms.', icon: <MilestoneIcon color="primary" /> },
    { title: 'Social Solidarity', description: 'Rallying support during regional natural calamities, medical crises, and supporting families in need.', icon: <Heart color={theme.palette.primary.main} size={24} /> },
    { title: 'Youth Empowerment', description: 'Creating active volunteer pipelines, giving leadership responsibility, and conducting skills bootcamps.', icon: <Users color={theme.palette.primary.main} size={24} /> },
  ];

  const stats = [
    { value: details.stat_legacy_value || '25+', label: details.stat_legacy_label || 'Years of Legacy' },
    { value: details.stat_committee_value || '150+', label: details.stat_committee_label || 'Active Members' },
    { value: details.stat_volunteers_value || '2,500+', label: details.stat_volunteers_label || 'Volunteers Registered' },
    { value: details.stat_attendees_value || '50K+', label: details.stat_attendees_label || 'Annual Attendees' }
  ];

  if (loading) {
    return (
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Typography>Loading About details...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "About Our Trust"}
        description={seo?.meta_description || "Learn more about the history, executive team, vision, and social initiatives of the Vikrin Community Trust."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
      />
      <PageHeader 
        title="About Us" 
        subtitle={details.about_preview_subtitle || "Discover our legacy of culture, faith, and community development."} 
      />

      {/* Core Mission & Vision */}
      <SectionWrapper bg="paper">
        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              OUR FOUNDATION
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
              {details.about_preview_title || "Empowering Community Through Social Action"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              {details.about_preview_text1 || "Vikrin Trust was founded in 2001 by a group of passionate youths determined to channel festive energy into social development."}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0, lineHeight: 1.7 }}>
              {details.about_preview_text2 || "We build systems that promote cultural awareness among youngsters while running daily charity programs."}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 4, 
                border: '1px solid', 
                borderColor: 'divider', 
                boxShadow: 'none',
                bgcolor: theme.palette.mode === 'light' ? 'rgba(245, 124, 0, 0.04)' : 'rgba(251, 146, 60, 0.05)',
                borderRadius: 4
              }}
            >
              <Box sx={{ display: 'flex', gap: 2.5, mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', color: 'primary.main', height: 'fit-content', border: '1px solid', borderColor: 'divider' }}>
                  <Target size={22} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Our Mission</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {details.about_preview_mission || "To leverage modern digital tools to coordinate cultural festivals, centralize charity pipelines, and build a cohesive database."}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', color: 'primary.main', height: 'fit-content', border: '1px solid', borderColor: 'divider' }}>
                  <Eye size={22} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Our Vision</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {details.about_preview_vision || "A transparent, digitized community ecosystem where citizens can easily fund local projects and apply for volunteer rosters."}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* Leadership Message Box */}
      {(details.about_preview_president_msg || details.about_preview_secretary_msg) && (
        <SectionWrapper bg="alternate">
          <Grid container spacing={4}>
            {details.about_preview_president_msg && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                  <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>PRESIDENT'S CORNER</Typography>
                  <Typography variant="body1" sx={{ mt: 2, mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                    "{details.about_preview_president_msg}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><Award /></Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Shree Vikranth Patil</Typography>
                      <Typography variant="caption" color="text.secondary">Chief President, Vikrin Trust</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}
            {details.about_preview_secretary_msg && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                  <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>SECRETARY'S DESK</Typography>
                  <Typography variant="body1" sx={{ mt: 2, mb: 3, fontStyle: 'italic', lineHeight: 1.7 }}>
                    "{details.about_preview_secretary_msg}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}><Users /></Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Rajesh Nair</Typography>
                      <Typography variant="caption" color="text.secondary">General Secretary</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        </SectionWrapper>
      )}

      {/* Historical Timeline Roadmap */}
      {timeline.length > 0 && (
        <SectionWrapper bg="paper">
          <SectionTitle
            badge="Historical Archives"
            title="Our Evolution Journey"
            subtitle="The chronology of how our welfare trust expanded over the years."
          />
          <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
            {timeline.map((item, idx) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 4, mb: 4, position: 'relative' }}>
                {idx < timeline.length - 1 && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      left: 20, 
                      top: 40, 
                      bottom: -30, 
                      width: 2, 
                      bgcolor: 'divider' 
                    }} 
                  />
                )}
                <Box 
                  sx={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    zIndex: 1
                  }}
                >
                  {idx + 1}
                </Box>
                <Paper sx={{ p: 3, flexGrow: 1, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 800, fontSize: '1.5rem', mb: 1 }}>
                    {item.year} - {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </SectionWrapper>
      )}

      {/* Core Values */}
      <SectionWrapper bg="alternate">
        <SectionTitle
          badge="Guiding Light"
          title="Our Core Values"
          subtitle="The principles that direct our choices, from cultural processions to medical aid camps."
        />
        <Grid container spacing={4}>
          {values.map((val, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card sx={{ height: '100%', p: 2 }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {val.icon}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 1.5 }}>
                      {val.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {val.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>

      {/* Stats Block */}
      <SectionWrapper bg="paper">
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx} sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 800, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {stat.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Verified metrics
              </Typography>
            </Grid>
          ))}
        </Grid>
      </SectionWrapper>
    </Box>
  );
};

// Simple placeholder icon
const MilestoneIcon = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-milestone">
    <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
    <path d="M12 13v8" />
    <path d="M12 3v3" />
  </svg>
);

export default About;
