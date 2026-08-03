import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Box, Typography, Paper, Container, Stack, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { keyframes } from '@mui/system';
import api from '../../services/api';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

// CSS Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Slow zoom keyframe
const slowZoom = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
`;

const responsiveWidths = [360, 375, 390, 430, 768, 1024, 1440, 1920];

const buildImageUrl = (url, width) => {
  if (!url) return url;
  if (url.includes('w=')) {
    return url.replace(/([?&])w=\d+/, `$1w=${width}`);
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&auto=format&fit=crop`;
};

const buildSrcSet = (url) =>
  responsiveWidths.map((width) => `${buildImageUrl(url, width)} ${width}w`).join(', ');

const HeroBanner = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.get('/home.php');
        if (res.success && res.data) {
          const mapped = res.data.map(slide => ({
            id: slide.id,
            image: slide.image_url,
            badge: slide.badge || '',
            heading: slide.heading,
            description: slide.description || '',
            primaryBtn: { text: slide.primary_btn_text || 'Explore Events', link: slide.primary_btn_link || '/events' },
            secondaryBtn: { text: slide.secondary_btn_text || 'Become a Volunteer', link: slide.secondary_btn_link || '/volunteer' }
          }));
          setSlides(mapped);
        }
      } catch (err) {
        console.error('Failed to load hero slides:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0F172A', color: '#fff' }}>
        <Typography variant="h6">Loading Banners...</Typography>
      </Box>
    );
  }

  if (slides.length === 0) return null;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#0F172A',
        '& .swiper': {
          width: '100%',
          height: '100%',
        },
        '& .swiper-slide': {
          height: '100%',
        },
        '& .swiper-pagination-bullet': {
          width: 10,
          height: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          opacity: 1,
          transition: 'all 0.3s ease',
        },
        '& .swiper-pagination-bullet-active': {
          width: 24,
          borderRadius: 4,
          backgroundColor: theme.palette.primary.main,
        },
        '& .swiper-button-prev, & .swiper-button-next': {
          color: '#FFFFFF',
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&::after': {
            fontSize: '1.25rem',
            fontWeight: 'bold',
          },
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: '#FFFFFF',
            boxShadow: `0 0 16px ${theme.palette.primary.main}5A`,
          },
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        speed={1000}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        navigation={true}
        grabCursor={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'stretch',
                }}
              >
                <Box
                  component="img"
                  src={buildImageUrl(slide.image, 1200)}
                  srcSet={buildSrcSet(slide.image)}
                  sizes="(max-width: 430px) 100vw, (max-width: 768px) 100vw, 1200px"
                  alt={slide.heading}
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: { xs: 'center 30%', md: 'center center' },
                    animation: isActive ? `${slowZoom} 14s ease-out forwards` : 'none',
                    zIndex: 1,
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.46) 42%, rgba(15, 23, 42, 0.18) 100%)',
                    zIndex: 2,
                  }}
                />

                <Container
                  maxWidth="lg"
                  sx={{
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    px: { xs: 2, sm: 3 },
                    py: { xs: 5, md: 0 },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      minHeight: '100%',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        width: '100%',
                        maxWidth: 720,
                        p: { xs: 4, sm: 5, md: 6 },
                        borderRadius: { xs: 4, md: 5 },
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        background: 'rgba(7, 12, 28, 0.72)',
                        backdropFilter: 'blur(22px)',
                        WebkitBackdropFilter: 'blur(22px)',
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.32)',
                        color: '#FFFFFF',
                        mx: { xs: 0, md: 0 },
                        my: { xs: 4, md: 0 },
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <Typography
                          variant="overline"
                          sx={{
                            color: 'primary.light',
                            fontWeight: 700,
                            letterSpacing: 1.5,
                            fontSize: '0.8rem',
                            mb: 2,
                            display: 'inline-flex',
                            alignItems: 'center',
                            px: 2,
                            py: 0.75,
                            borderRadius: 5,
                            backgroundColor: 'rgba(245, 124, 0, 0.18)',
                            border: '1px solid rgba(245, 124, 0, 0.24)',
                          }}
                        >
                          {slide.badge}
                        </Typography>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <Typography
                          variant="h1"
                          sx={{
                            fontWeight: 800,
                            fontSize: {
                              xs: 'clamp(2.2rem, 7vw, 2.75rem)',
                              sm: 'clamp(2.75rem, 5vw, 3.5rem)',
                              md: 'clamp(3.2rem, 3vw, 4.25rem)',
                            },
                            lineHeight: 1.1,
                            mb: 2.5,
                            color: '#FFFFFF',
                            letterSpacing: '-0.03em',
                          }}
                        >
                          {slide.heading}
                        </Typography>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: { xs: 'clamp(0.95rem, 2vw, 1.05rem)', md: '1.075rem' },
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.88)',
                            mb: 4.5,
                            fontWeight: 400,
                          }}
                        >
                          {slide.description}
                        </Typography>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                          sx={{ width: '100%', alignItems: { xs: 'stretch', sm: 'center' } }}
                        >
                          <PrimaryButton
                            to={slide.primaryBtn.link}
                            size="large"
                            endIcon={<ArrowRight size={18} />}
                            fullWidth={!isDesktop}
                          >
                            {slide.primaryBtn.text}
                          </PrimaryButton>
                          <SecondaryButton
                            to={slide.secondaryBtn.link}
                            size="large"
                            startIcon={<Info size={18} />}
                            fullWidth={!isDesktop}
                            sx={{
                              color: '#FFFFFF',
                              borderColor: 'rgba(255, 255, 255, 0.45)',
                              '&:hover': {
                                borderColor: '#FFFFFF',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              },
                            }}
                          >
                            {slide.secondaryBtn.text}
                          </SecondaryButton>
                        </Stack>
                      </motion.div>
                    </Paper>
                  </Box>
                </Container>
              </Box>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroBanner;
