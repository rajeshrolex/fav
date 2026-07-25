import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Paper, Typography, Divider } from '@mui/material';
import SEO from '../../components/seo/SEO';
import PageHeader from '../../components/common/PageHeader';
import { SectionWrapper } from '../../components/sections/HomeSections';

const dynamicPagesData = {
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Legal regulations for utilizing the Vikrin Community Platform.',
    lastUpdated: 'July 25, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing and utilizing the Vikrin Hub portal (including volunteer registrations and secure donations), you formally consent to be bound by these Terms and Conditions. If you disagree, please refrain from submitting information.'
      },
      {
        heading: '2. User Accounts & Data',
        body: 'We collect registration data for committee management. You warrant that all input data (PAN details, phone numbers, addresses) is authentic and up-to-date.'
      },
      {
        heading: '3. Donation Refunds',
        body: 'Donations made to the Vikrin Welfare Trust are voluntary contributions. They are eligible for Section 80G tax deductions but are non-refundable once the transaction completes.'
      }
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we gather, store, and shield your personal registration records.',
    lastUpdated: 'July 25, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect name, email address, PAN card numbers, and phone numbers exclusively to process volunteer applications, issue tax exemption receipts, and coordinate festival security passes.'
      },
      {
        heading: '2. Security & Compliance',
        body: 'Your credentials are encrypted and stored securely. We do not sell or share user contact data with third-party advertising companies.'
      },
      {
        heading: '3. Cookies & Analytics',
        body: 'We use local browser storage and basic analytics cookies to save user interface settings (like system dark-mode toggles) and track event calendar views.'
      }
    ]
  },
  disclaimer: {
    title: 'Welfare Trust Disclaimer',
    subtitle: 'General trust declarations and operational disclosures.',
    lastUpdated: 'July 25, 2026',
    sections: [
      {
        heading: '1. General Info Only',
        body: 'The dates, itineraries, and decoration drafts displayed on this website represent current committee plans and are subject to weather adjustments or police coordination clearances.'
      },
      {
        heading: '2. No Commercial Assurances',
        body: 'Vikrin Welfare Trust is a registered non-profit. All resources supplied are provided for social and religious objectives, and are not intended for commercial trade.'
      }
    ]
  }
};

const DynamicPage = () => {
  const { slug } = useParams();
  const page = dynamicPagesData[slug];

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Box>
      <SEO
        title={page.title}
        description={page.subtitle}
      />
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
      />

      <SectionWrapper bg="paper">
        <Paper sx={{ p: { xs: 4, md: 6 }, border: '1px solid', borderColor: 'divider', boxShadow: 'none', maxWidth: 800, mx: 'auto' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3, fontWeight: 650 }}>
            Last Updated: {page.lastUpdated}
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {page.sections.map((section, idx) => (
              <Box key={idx}>
                <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 700, mb: 1.5 }}>
                  {section.heading}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {section.body}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </SectionWrapper>
    </Box>
  );
};

export default DynamicPage;
