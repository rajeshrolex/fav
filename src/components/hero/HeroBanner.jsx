import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Box, Typography, Paper, Container, Stack, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { keyframes } from '@mui/system';
import { heroSlides } from '../../constants/mockData';
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

const HeroBanner = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: '90vh', md: '100vh' },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#0F172A',
        '& .swiper': {
          width: '100%',
          height: '100%',
        },
        // Premium customized pagination dots
        '& .swiper-pagination-bullet': {
          width: 10,
          height: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          opacity: 1,
          transition: 'all 0.3s ease',
        },
        '& .swiper-pagination-bullet-active': {
          width: 24,
          borderRadius: 4,
          backgroundColor: theme.palette.primary.main,
        },
        // Premium customized navigation arrows
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
          display: { xs: 'none', md: 'flex' }
        }
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
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Background image with slow zoom when active */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: isActive ? `${slowZoom} 10s ease-out forwards` : 'none',
                    zIndex: 1,
                  }}
                />

                {/* Dark gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.45) 100%)',
                    zIndex: 2,
                  }}
                />

                {/* Content wrapper */}
                <Container
                  maxWidth="lg"
                  sx={{
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    pt: { xs: 8, md: 0 },
                  }}
                >
                  <Paper
                    sx={{
                      p: { xs: 3.5, sm: 5, md: 6 },
                      maxWidth: 680,
                      borderRadius: 5,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: theme.palette.mode === 'light' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(17, 27, 53, 0.6)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                      color: '#FFFFFF',
                    }}
                  >
                    {/* Badge */}
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
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 5,
                          backgroundColor: 'rgba(245, 124, 0, 0.15)',
                          border: '1px solid rgba(245, 124, 0, 0.25)',
                        }}
                      >
                        {slide.badge}
                      </Typography>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                          lineHeight: 1.15,
                          mb: 2.5,
                          color: '#FFFFFF',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {slide.heading}
                      </Typography>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.95rem', md: '1.075rem' },
                          lineHeight: 1.6,
                          color: 'rgba(255, 255, 255, 0.85)',
                          mb: 4.5,
                          fontWeight: 400,
                        }}
                      >
                        {slide.description}
                      </Typography>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isActive ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <PrimaryButton
                          to={slide.primaryBtn.link}
                          size="large"
                          endIcon={<ArrowRight size={18} />}
                        >
                          {slide.primaryBtn.text}
                        </PrimaryButton>
                        <SecondaryButton
                          to={slide.secondaryBtn.link}
                          size="large"
                          startIcon={<Info size={18} />}
                          sx={{
                            color: '#FFFFFF',
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            '&:hover': {
                              borderColor: '#FFFFFF',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            }
                          }}
                        >
                          {slide.secondaryBtn.text}
                        </SecondaryButton>
                      </Stack>
                    </motion.div>
                  </Paper>
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
