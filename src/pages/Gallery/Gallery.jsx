import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { GalleryCard } from '../../components/cards/Cards';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import { Modal } from '../../components/common/Modals';

const Gallery = () => {
  const { trackVisit } = useConfig();
  const [tabValue, setTabValue] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(null);
  
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackVisit();
    const fetchGalleryData = async () => {
      try {
        // Load Page SEO
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'gallery' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }

        // Load Gallery items
        const res = await api.get('/gallery.php');
        if (res.success && res.data) {
          const mapped = res.data.map(g => ({
            id: g.id,
            title: g.title || 'Gallery Memory',
            category: g.category || 'General',
            image: g.media_url,
            media_type: g.media_type,
            media_url: g.media_url
          }));
          setItems(mapped);

          // Find unique categories
          const cats = ['All'];
          mapped.forEach(g => {
            if (g.category && !cats.includes(g.category)) {
              cats.push(g.category);
            }
          });
          setCategories(cats);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredItems = tabValue === 0
    ? items
    : items.filter(item => item.category === categories[tabValue]);

  const handlePrev = () => {
    setPhotoIndex(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setPhotoIndex(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Typography>Loading gallery media...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "Photo & Video Gallery"}
        description={seo?.meta_description || "Browse high-resolution photographs cataloging Ganesh Utsav decorations, volunteer activities, and local events."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
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
            <Grid item xs={12} md={6} lg={6} xl={4} key={item.id}>
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
