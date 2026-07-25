import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, Card, CardContent, Typography, Link as MuiLink } from '@mui/material';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { newsArticles } from '../../constants/mockData';
import { Modal } from '../../components/common/Modals';

const News = () => {
  const [searchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ['All', 'Press Release', 'Community Activity', 'Technology'];

  // Sync URL query ID for direct loading of article
  useEffect(() => {
    const articleId = searchParams.get('id');
    if (articleId) {
      const match = newsArticles.find(n => n.id === articleId);
      if (match) {
        setSelectedArticle(match);
      }
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredArticles = tabValue === 0
    ? newsArticles
    : newsArticles.filter(article => article.category === categories[tabValue]);

  return (
    <Box>
      <SEO
        title="News Center & Blog"
        description="Read official announcements, schedule releases, welfare camp statistics, and executive reports."
      />
      <PageHeader
        title="News & Articles"
        subtitle="Stay informed with official updates from the Vikrin Trust."
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
            aria-label="News category tabs"
          >
            {categories.map((cat, index) => (
              <Tab label={cat} key={index} sx={{ fontWeight: 650 }} />
            ))}
          </Tabs>
        </Box>

        {/* Articles list */}
        <Grid container spacing={4}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card 
                onClick={() => setSelectedArticle(article)}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <Box sx={{ overflow: 'hidden', height: 210 }}>
                  <Box
                    component="img"
                    src={article.image}
                    alt={article.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                    {article.category} | {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 1.5, lineHeight: 1.35, flexGrow: 1 }}>
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
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: 'primary.main',
                      textDecoration: 'none',
                    }}
                  >
                    Read Article <ArrowUpRight size={14} />
                  </MuiLink>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredArticles.length === 0 && (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 4 }}>
            No articles published in this category yet.
          </Typography>
        )}
      </SectionWrapper>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <Modal
          open={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          maxWidth="sm"
        >
          <Box sx={{ mb: 2, display: 'flex', gap: 3, color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} />
              <Typography variant="caption">{selectedArticle.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={16} />
              <Typography variant="caption">{selectedArticle.category}</Typography>
            </Box>
          </Box>

          <Box
            component="img"
            src={selectedArticle.image}
            alt={selectedArticle.title}
            sx={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'cover',
              borderRadius: 3,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />

          <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
            {selectedArticle.content}
          </Typography>
        </Modal>
      )}
    </Box>
  );
};

export default News;
