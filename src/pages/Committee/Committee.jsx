import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { CommitteeCard } from '../../components/cards/Cards';
import api from '../../services/api';
import { useConfig } from '../../context/ConfigContext';

const Committee = () => {
  const { trackVisit } = useConfig();
  const [tabValue, setTabValue] = useState(0);
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState(['All']);
  const [seo, setSeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackVisit();
    const fetchCommitteeData = async () => {
      try {
        // Load Page SEO
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'committee' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }

        // Load Committee Members
        const res = await api.get('/committee.php');
        if (res.success && res.data) {
          setMembers(res.data);
          
          // Reconstruct departments list dynamically from database entries
          const depts = ['All'];
          res.data.forEach(m => {
            if (m.department && !depts.includes(m.department)) {
              depts.push(m.department);
            }
          });
          setDepartments(depts);
        }
      } catch (err) {
        console.error('Failed to load committee:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommitteeData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredMembers = tabValue === 0
    ? members
    : members.filter(member => member.department === departments[tabValue]);

  if (loading) {
    return (
      <Box sx={{ py: 15, textAlign: 'center' }}>
        <Typography>Loading committee members...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <SEO
        title={seo?.meta_title || "Our Committee"}
        description={seo?.meta_description || "Meet the executive trustees and leaders heading the Vikrin Community Welfare Trust."}
        keywords={seo?.meta_keywords}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
      />
      <PageHeader 
        title="Committee Directory" 
        subtitle="Learn more about the dedicated members structuring our operations." 
      />

      <SectionWrapper bg="paper">
        {/* Tabs Filter */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 5, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Committee department tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.95rem',
                pb: 1.5,
              }
            }}
          >
            {departments.map((dept, index) => (
              <Tab label={dept} key={index} />
            ))}
          </Tabs>
        </Box>

        {/* Members Grid */}
        <Grid container spacing={4}>
          {filteredMembers.map((member) => (
            <Grid item xs={12} md={6} lg={6} xl={4} key={member.id}>
              <CommitteeCard member={member} />
            </Grid>
          ))}
        </Grid>

        {filteredMembers.length === 0 && (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 4 }}>
            No committee members registered in this department yet.
          </Typography>
        )}
      </SectionWrapper>
    </Box>
  );
};

export default Committee;
