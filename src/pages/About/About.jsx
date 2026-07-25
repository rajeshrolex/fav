import React from 'react';
import { Box, Grid, Typography, Paper, useTheme, Card, CardContent } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import SectionTitle from '../../components/common/SectionTitle';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { Target, Heart, Eye, Users } from 'lucide-react';
import { statistics } from '../../constants/mockData';
import { motion } from 'framer-motion';

const About = () => {
  const theme = useTheme();

  const values = [
    { title: 'Cultural Integrity', description: 'Preserving and promoting traditional Indian festivals and folklore in their purest, most vibrant forms.', icon: <MilestoneIcon color="primary" /> },
    { title: 'Social Solidarity', description: 'Rallying support during regional natural calamities, medical crises, and supporting families in need.', icon: <Heart color={theme.palette.primary.main} size={24} /> },
    { title: 'Youth Empowerment', description: 'Creating active volunteer pipelines, giving leadership responsibility, and conducting skills bootcamps.', icon: <Users color={theme.palette.primary.main} size={24} /> },
  ];

  return (
    <Box>
      <SEO
        title="About Our Trust"
        description="Learn more about the history, executive team, vision, and social initiatives of the Vikrin Community Trust."
      />
      <PageHeader 
        title="About Us" 
        subtitle="Discover our 25-year legacy of culture, faith, and community development." 
      />

      {/* Core Mission & Vision */}
      <SectionWrapper bg="paper">
        <Grid container spacing={5} sx={{ alignItems: 'center' }}>
          <Grid item xs={12} md={6}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              OUR FOUNDATION
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
              Empowering Community Through Social Action
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              Vikrin Trust was founded in 2001 by a group of passionate youths determined to channel festive energy into social development. What began as a neighborhood circle has grown into a structured trust catering to hundreds of families.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0, lineHeight: 1.7 }}>
              We build systems that promote cultural awareness among youngsters while running daily operations like distributing school books to low-income children, setting up mobile blood centers, and offering scholarship grants.
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
                    To leverage modern digital tools to coordinate cultural festivals, centralize charity pipelines, and build a cohesive database of volunteers.
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
                    A transparent, digitized community ecosystem where citizens can easily fund local projects, apply for volunteer rosters, and check trust audits in real-time.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </SectionWrapper>

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
          {statistics.map((stat, idx) => (
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
