import React, { useState } from 'react';
import { Box, Tabs, Tab, Grid, Typography, Container } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';
import { CommitteeCard } from '../../components/cards/Cards';
import { committeeMembers } from '../../constants/mockData';

const Committee = () => {
  const [tabValue, setTabValue] = useState(0);

  const departments = ['All', 'Executive Committee', 'Youth Committee', 'Finance & Trust'];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredMembers = tabValue === 0
    ? committeeMembers
    : committeeMembers.filter(member => member.department === departments[tabValue]);

  return (
    <Box>
      <SEO
        title="Our Committee"
        description="Meet the executive trustees and leaders heading the Vikrin Community Welfare Trust."
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
            <Grid item xs={12} sm={6} md={3} key={member.id}>
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
