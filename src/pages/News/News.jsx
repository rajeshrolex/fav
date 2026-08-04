import React, { useState, useEffect } from 'react';
import { Box, Grid, Tabs, Tab, Card, CardContent, Typography, Link as MuiLink } from '@mui/material';
import { ArrowUpRight, Calendar, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';
import { Modal } from '../../components/common/Modals';

const News = () => {
  const [searchParams] = useSearchParams();
  const { trackVisit } = useConfig();
  const [tabValue, setTabValue] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackVisit();
    const fetchNewsData = async () => {
      try {
        // Load Page SEO
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'news' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }

        // Load news articles
        const res = await api.get('/news.php');
        if (res.success && res.data) {
          const mapped = res.data.map(n => ({
            id: n.id,
            title: n.title,
            slug: n.slug,
            category: n.category || 'General',
            author: n.author || 'Admin',
            summary: n.summary || '',
            content: n.content,
            image: n.featured_image,
            date: n.publish_date
          }));
          setArticles(mapped);

          // Find unique categories
          const cats = ['All'];
          mapped.forEach(n => {
            if (n.category && !cats.includes(n.category)) {
              cats.push(n.category);
            }
          });
          setCategories(cats);

          // Sync URL query ID for direct loading of article
          const articleId = searchParams.get('id');
          const articleSlug = searchParams.get('slug');
          if (articleId) {
            const match = mapped.find(n => String(n.id) === String(articleId));
            if (match) setSelectedArticle(match);
          } else if (articleSlug) {
            const match = mapped.find(n => n.slug === articleSlug);
            if (match) setSelectedArticle(match);
          }
        }
      } catch (err) {
        console.error('Failed to load news articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsData();
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredArticles = tabValue === 0
    ? articles
    : articles.filter(article => article.category === categories[tabValue]);

  if (loading) {
    return (
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Typography>Loading news articles...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "News Center & Blog"}
        description={seo?.meta_description || "Read official announcements, schedule releases, welfare camp statistics, and executive reports."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
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
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.95rem',
                pb: 1.5,
              }
            }}
          >
            {categories.map((cat, index) => (
              <Tab label={cat} key={index} />
            ))}
          </Tabs>
        </Box>

        {/* Articles list */}
        <Grid container spacing={4}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} md={6} lg={6} xl={4} key={article.id}>
              <Card 
                onClick={() => setSelectedArticle(article)}
                sx={{ 
                  width: '100%',
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
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
              <Typography variant="caption">{new Date(selectedArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <User size={16} />
              <Typography variant="caption">{selectedArticle.category} (By: {selectedArticle.author})</Typography>
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

          <Typography 
            variant="body1" 
            sx={{ lineHeight: 1.7, color: 'text.secondary' }}
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />
        </Modal>
      )}
    </Box>
  );
};

export default News;
