import React, { useState } from 'react';
import { Box, Grid, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { GalleryCard } from '../../components/cards/Cards';
import { galleryItems } from '../../constants/mockData';
import { Modal } from '../../components/common/Modals';

const Gallery = () => {
  const [tabValue, setTabValue] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(null);

  const categories = ['All', 'Festivals', 'Social Work', 'Cultural', 'Community'];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredItems = tabValue === 0
    ? galleryItems
    : galleryItems.filter(item => item.category === categories[tabValue]);

  const handlePrev = () => {
    setPhotoIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setPhotoIndex(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box>
      <SEO
        title="Photo & Video Gallery"
        description="Browse high-resolution photographs cataloging Ganesh Utsav decorations, volunteer activities, and local events."
      />
      <PageHeader
        title="Photo Gallery"
        subtitle="Visual memories of our community celebrations and social camps."
      />

      <SectionWrapper bg="paper">
        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 5, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Gallery category filters"
          >
            {categories.map((cat, index) => (
              <Tab label={cat} key={index} sx={{ fontWeight: 650 }} />
            ))}
          </Tabs>
        </Box>

        {/* Gallery Grid */}
        <Grid container spacing={3.5}>
          {filteredItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <GalleryCard item={item} onSelect={() => setPhotoIndex(idx)} />
            </Grid>
          ))}
        </Grid>

        {filteredItems.length === 0 && (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 4 }}>
            No images cataloged under this category.
          </Typography>
        )}
      </SectionWrapper>

      {/* Full Screen Lightbox Modal */}
      {photoIndex !== null && filteredItems[photoIndex] && (
        <Modal
          open={photoIndex !== null}
          onClose={() => setPhotoIndex(null)}
          title={filteredItems[photoIndex].title}
          maxWidth="md"
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}>
            <Box
              component="img"
              src={filteredItems[photoIndex].image}
              alt={filteredItems[photoIndex].title}
              sx={{
                maxWidth: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
            />

            {/* Left Nav Arrow */}
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 8,
                bgcolor: 'rgba(15, 23, 42, 0.6)',
                color: '#FFF',
                '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.8)' }
              }}
            >
              <ChevronLeft size={22} />
            </IconButton>

            {/* Right Nav Arrow */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                bgcolor: 'rgba(15, 23, 42, 0.6)',
                color: '#FFF',
                '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.8)' }
              }}
            >
              <ChevronRight size={22} />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, fontWeight: 550 }}>
            Category: {filteredItems[photoIndex].category} ({photoIndex + 1} of {filteredItems.length})
          </Typography>
        </Modal>
      )}
    </Box>
  );
};

export default Gallery;
