import React from 'react';
import { Box, Container, Grid, Typography, Stack, Paper, useTheme, Card, CardContent, Link as MuiLink, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Milestone, Phone, Users, Shield, Calendar, ArrowUpRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';
import SectionTitle from '../common/SectionTitle';
import { EventCard, GalleryCard, SponsorCard, CommitteeCard } from '../cards/Cards';
import { statistics, upcomingEvents, committeeMembers, galleryItems, sponsors, newsArticles, historyTimeline } from '../../constants/mockData';

// Reusable Section Wrapper
export const SectionWrapper = ({ children, bg = 'default', id, sx = {} }) => {
  const theme = useTheme();
  
  const getBgColor = () => {
    if (bg === 'paper') return theme.palette.background.paper;
    if (bg === 'alternate') {
      return theme.palette.mode === 'light' ? '#F1F5F9' : '#0E172C';
    }
    if (bg === 'gradient') {
      return theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, #FFF3E0 100%)`
        : `linear-gradient(135deg, ${theme.palette.background.default} 0%, #1A1F38 100%)`;
    }
    return theme.palette.background.default;
  };

  return (
    <Box
      id={id}
      sx={{
        py: { xs: 6, md: 10 },
        background: getBgColor(),
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        ...sx,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px !important',
          width: '100%',
          mx: 'auto',
          px: { xs: '24px', sm: '24px', md: '24px', lg: '24px', xl: '24px' },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

// 1. Welcome & Stats Section
export const WelcomeSection = ({ stats = statistics, settings = {} }) => {
  return (
    <SectionWrapper bg="paper" id="welcome">
      <Grid container spacing={5} sx={{ alignItems: 'center' }}>
        <Grid xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              {settings.welcome_tag || "WELCOME TO VIKRIN"}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
              {settings.welcome_title || "Connecting Local Communities, Digitally."}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              {settings.welcome_description || "Vikrin is an enterprise-grade ecosystem tailored for youth circles, NGOs, Ganeshotsav committees, and public trusts. We bridge historical faith and cultural celebrations with state-of-the-art web systems—helping committees seamlessly coordinate programs, gather donations, catalog history, and mobilize volunteer support."}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <PrimaryButton to="/about" endIcon={<ArrowRight size={16} />}>
                Read Our Story
              </PrimaryButton>
              <SecondaryButton to="/volunteer">
                Join Today
              </SecondaryButton>
            </Stack>
          </motion.div>
        </Grid>

        <Grid xs={12} md={6}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid xs={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 'none',
                      bgcolor: 'background.default',
                      borderRadius: 4,
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: 'primary.light',
                        transform: 'translateY(-5px)',
                        boxShadow: (theme) => `0 10px 30px ${theme.palette.primary.main}0D`,
                      }
                    }}
                  >
                    <Typography
                      variant="h2"
                      color="primary"
                      sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </SectionWrapper>
  );
};

// 2. About Preview
export const AboutPreview = ({ settings = {} }) => {
  const theme = useTheme();

  const pillars = [
    {
      title: settings.about_preview_pillar1_title || 'Empowering Youth & Legacy',
      description: settings.about_preview_pillar1_desc || 'Orchestrating cultural celebrations, welfare drives, free student clinics, and athletic leagues.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.palette.primary.main }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      title: settings.about_preview_pillar2_title || 'Digital Operations Hub',
      description: settings.about_preview_pillar2_desc || 'Providing local committees a unified toolkit for volunteer rosters, donation tracking, and event registrations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.palette.primary.main }}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M21 9H3" />
          <path d="M21 15H3" />
          <path d="M12 3v18" />
        </svg>
      )
    }
  ];

  return (
    <SectionWrapper bg="alternate" id="about-preview">
      <SectionTitle
        badge={settings.about_preview_badge || "Our Identity"}
        title={settings.about_preview_title || "Who We Are"}
        subtitle={settings.about_preview_subtitle || "Bridging cultural heritage with modern tech infrastructure to empower local organizations."}
      />
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Side: Narrative and features */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.75 }}>
              {settings.about_preview_text1 || "For over two decades, the Vikrin Community Trust has been at the forefront of orchestrating cultural celebrations, social initiatives, and public welfare. Through the introduction of the Vikrin Hub portal, we seek to scale local operations by providing youth groups, committees, and trusts with enterprise-ready digital software kits."}
            </Typography>

            {/* Pillar Points */}
            <Stack spacing={3} sx={{ mb: 5.5 }}>
              {pillars.map((p, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2.5 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(245, 124, 0, 0.08)' : 'rgba(251, 146, 60, 0.12)',
                      height: 'fit-content',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: (theme) => theme.palette.mode === 'light' ? 'rgba(245, 124, 0, 0.12)' : 'rgba(251, 146, 60, 0.2)'
                    }}
                  >
                    {p.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>
                      {p.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.9rem' }}>
                      {p.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <PrimaryButton to="/about" endIcon={<ArrowRight size={16} />}>
              Read Our Full Story
            </PrimaryButton>
          </motion.div>
        </div>

        {/* Right Side: Visual stack */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ position: 'relative', pl: { md: 4 } }}>
              {/* Outer Decorative Element */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  zIndex: 0,
                  opacity: 0.5,
                  display: { xs: 'none', md: 'block' }
                }}
              />
              
              {/* Main Image Frame */}
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 6,
                  overflow: 'hidden',
                  zIndex: 1,
                  boxShadow: (theme) => theme.palette.mode === 'light' 
                    ? '0px 12px 40px rgba(148, 163, 184, 0.25)' 
                    : '0px 12px 40px rgba(2, 6, 23, 0.7)',
                  border: '1px solid',
                  borderColor: 'divider',
                  aspectRatio: '16/11',
                  backgroundColor: 'background.paper'
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop"
                  alt="Community collaboration"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.03)'
                    }
                  }}
                />
              </Box>

              {/* Floating Overlay Badge */}
              <Paper
                sx={{
                  position: 'absolute',
                  bottom: -24,
                  left: 24,
                  zIndex: 2,
                  py: 2,
                  px: 3,
                  borderRadius: 3,
                  border: '1.5px solid',
                  borderColor: 'primary.main',
                  background: (theme) => theme.palette.mode === 'light' 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(17, 27, 53, 0.9)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="h3" color="primary" sx={{ fontWeight: 800, fontSize: '1.75rem', lineHeight: 1 }}>
                  {settings.about_preview_years || "25+"}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: 'text.secondary', lineHeight: 1.2 }}>
                  {settings.about_preview_years_label || "Years of Heritage"}
                </Typography>
              </Paper>
            </Box>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

// 3. Festival History Preview
export const FestivalHistoryPreview = ({ timeline = historyTimeline }) => {
  return (
    <SectionWrapper bg="paper" id="history-preview">
      <SectionTitle
        badge="Legacy Roadmap"
        title="Our Festival History"
        subtitle="From a small neighborhood street corner to managing regional festivals with thousands of attendees."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {timeline.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex w-full">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Paper sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none', position: 'relative' }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 800, mb: 2, fontSize: '2rem' }}>
                  {item.year}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </Paper>
            </motion.div>
          </div>
        ))}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <SecondaryButton to="/festival-history" endIcon={<Milestone size={16} />}>
          View Detailed Timeline
        </SecondaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 4. Upcoming Events
export const UpcomingEvents = ({ events = upcomingEvents }) => {
  const upcomingOnly = events.filter(e => e.status === 'Upcoming').slice(0, 3);
  return (
    <SectionWrapper bg="alternate" id="events-preview">
      <SectionTitle
        badge="Get Involved"
        title="Upcoming Events"
        subtitle="Participate in our upcoming cultural programs, social camps, and youth campaigns."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {upcomingOnly.map((event) => (
          <div key={event.id} className="flex w-full">
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <EventCard event={event} />
            </motion.div>
          </div>
        ))}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <SecondaryButton to="/events" endIcon={<Calendar size={16} />}>
          View All Events
        </SecondaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 5. Committee Preview
export const CommitteePreview = ({ members = committeeMembers }) => {
  return (
    <SectionWrapper bg="paper" id="committee-preview">
      <SectionTitle
        badge="Our Leaders"
        title="Committee Members"
        subtitle="The dedicated individuals steering the planning and executing of our community activities."
      />
      <Grid container spacing={4}>
        {members.slice(0, 4).map((member) => (
          <Grid item xs={12} md={6} lg={6} xl={3} key={member.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CommitteeCard member={member} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <SecondaryButton to="/committee" endIcon={<Users size={16} />}>
          View Whole Committee
        </SecondaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 6. Gallery Preview
export const GalleryPreview = ({ items = galleryItems }) => {
  return (
    <SectionWrapper bg="alternate" id="gallery-preview">
      <SectionTitle
        badge="Media Center"
        title="Recent Gallery Highlights"
        subtitle="Capturing moments of happiness, dedication, and teamwork during our community drives."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="w-full">
            <GalleryCard item={item} />
          </div>
        ))}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <SecondaryButton to="/gallery" endIcon={<ArrowUpRight size={16} />}>
          View Photo Gallery
        </SecondaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 7. Sponsors Section
export const Sponsors = ({ list = sponsors }) => {
  return (
    <SectionWrapper bg="paper" id="sponsors-preview">
      <SectionTitle
        badge="Our Partners"
        title="Sponsors & Supporters"
        subtitle="We express our deep gratitude to these organizations backing our social and cultural agendas."
      />
      <Grid container spacing={3} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        {list.map((sponsor) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={sponsor.id}>
            <SponsorCard sponsor={sponsor} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <SecondaryButton to="/sponsors" endIcon={<Shield size={16} />}>
          Become a Sponsor
        </SecondaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 8. Volunteer Call To Action
export const VolunteerCTA = () => {
  return (
    <SectionWrapper 
      bg="gradient" 
      id="volunteer-cta" 
      sx={{ 
        textAlign: 'center',
        background: (theme) => theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' 
          : 'linear-gradient(135deg, #1A1C30 0%, #121424 100%)',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ maxWidth: 700, mx: 'auto', py: 2 }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
          JOIN THE SQUAD
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 2.5 }}>
          Become a Registered Volunteer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4.5, lineHeight: 1.7, px: { xs: 0, md: 2 } }}>
          Your skills can help us make local festivals more organized, cleaner, and impactful. Register in our directory, choose your field of interest, and get instant updates on mobilization drives.
        </Typography>
        <PrimaryButton to="/volunteer" size="large" endIcon={<ArrowRight size={18} />}>
          Apply as a Volunteer
        </PrimaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 9. Donation Call To Action
export const DonationCTA = () => {
  return (
    <SectionWrapper bg="paper" id="donation-cta">
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          border: '1px solid',
          borderColor: 'primary.light',
          background: (theme) => theme.palette.mode === 'light' 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 237, 213, 0.4) 100%)' 
            : 'linear-gradient(135deg, rgba(17, 27, 53, 0.9) 0%, rgba(245, 124, 0, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: (theme) => `0 10px 40px ${theme.palette.primary.main}0D`,
        }}
      >
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid xs={12} md={8}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              SUPPORT OUR WORK
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
              Fuel Community Projects & Celebrations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0, lineHeight: 1.6 }}>
              All donations received by Vikrin Community Welfare Trust go directly into funding public infrastructure, community feasts (Bhandara), free healthcare campaigns, and education aids. We maintain audited accounts that are visible on the admin dashboard for full transparency.
            </Typography>
          </Grid>
          <Grid xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <PrimaryButton 
              to="/volunteer?action=donate" 
              size="large"
              startIcon={<Gift size={20} />}
              sx={{
                px: 4.5,
                py: 1.75,
                boxShadow: (theme) => `0 4px 18px ${theme.palette.primary.main}4A`
              }}
            >
              Donate Now
            </PrimaryButton>
          </Grid>
        </Grid>
      </Paper>
    </SectionWrapper>
  );
};

// 10. Latest News Preview
// 8. Latest News Section
export const LatestNewsPreview = ({ news = newsArticles }) => {
  return (
    <SectionWrapper bg="alternate" id="news-preview">
      <SectionTitle
        badge="Press Center"
        title="Latest News & Articles"
        subtitle="Keep abreast of recent announcements, schedules, and press releases."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {news.slice(0, 3).map((article) => {
          const img = article.featured_image || article.image;
          const date = article.publish_date || article.date;
          return (
          <div key={article.id} className="flex">
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ overflow: 'hidden', height: 200, position: 'relative' }}>
                <Box
                  component="img"
                  src={img}
                  alt={article.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                    '&:hover': { transform: 'scale(1.04)' }
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                  {article.category} | {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1.15rem', fontWeight: 700, mb: 1.5, lineHeight: 1.35, flexGrow: 1 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  mb: 3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {article.summary}
                </Typography>
                <MuiLink
                  component={Link}
                  to={article.slug ? `/news/${article.slug}` : `/news?id=${article.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Read Full Article <ArrowUpRight size={14} />
                </MuiLink>
              </CardContent>
            </Card>
          </div>
        );})}
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <SecondaryButton to="/news">
          View Blog Archives
        </SecondaryButton>
      </Box>
    </SectionWrapper>
  );
};

// 11. Contact Preview
export const ContactPreview = ({ settings = {} }) => {
  return (
    <SectionWrapper bg="paper" id="contact-preview">
      <SectionTitle
        badge="Get In Touch"
        title="Contact Our Team"
        subtitle="Have queries regarding registrations, donation audits, or sponsorship tiers? Drop us a line."
      />
      <Grid container spacing={5} sx={{ alignItems: 'center' }}>
        <Grid xs={12} md={5}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: '1.5rem' }}>
            We'd love to hear from you
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            Our office is open from Monday to Saturday, 9 AM to 6 PM. For emergency volunteer mobilization, you can reach out directly to our helpdesk.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(245, 124, 0, 0.08)', color: 'primary.main', height: 'fit-content' }}>
                <Phone size={20} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Call Us</Typography>
                <Typography variant="body2" color="text.secondary">{settings.contact_phone || "+91 22 2456 7890"}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(245, 124, 0, 0.08)', color: 'primary.main', height: 'fit-content' }}>
                <Mail size={20} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Email Address</Typography>
                <Typography variant="body2" color="text.secondary">{settings.contact_email || "support@vikrin.org"}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(245, 124, 0, 0.08)', color: 'primary.main', height: 'fit-content' }}>
                <Users size={20} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Helpdesk Hours</Typography>
                <Typography variant="body2" color="text.secondary">Monday - Saturday (9:00 AM - 6:00 PM)</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid xs={12} md={7}>
          <Paper
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: 4,
              background: (theme) => theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgba(17, 27, 53, 0.4)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 1 }}>
              Leave a Message
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fill out this quick form, and our coordinator will write back within 24 hours.
            </Typography>

            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField label="Full Name" fullWidth />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField label="Email Address" fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField label="Subject" fullWidth />
              </Grid>
              <Grid xs={12}>
                <TextField label="Message" multiline rows={4} fullWidth />
              </Grid>
              <Grid xs={12}>
                <PrimaryButton to="/contact" fullWidth>
                  Go to Contact Page Form
                </PrimaryButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </SectionWrapper>
  );
};
