import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, ogUrl, canonicalUrl }) => {
  const siteTitle = 'Vikrin Community Platform';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDesc = 'Empowering youth clubs, Ganesh Utsav committees, trusts, and NGOs with modern digital infrastructure, event tracking, and volunteer portals.';
  const metaDesc = description || defaultDesc;
  const defaultImage = 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop';
  
  return (
    <Helmet>
      {/* General Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={ogImage || defaultImage} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* Canonical Link */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEO;
