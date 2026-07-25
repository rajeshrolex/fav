import React from 'react';
import SEO from '../../components/seo/SEO';
import HeroBanner from '../../components/hero/HeroBanner';
import {
  WelcomeSection,
  AboutPreview,
  FestivalHistoryPreview,
  UpcomingEvents,
  CommitteePreview,
  GalleryPreview,
  Sponsors,
  VolunteerCTA,
  DonationCTA,
  LatestNewsPreview,
  ContactPreview
} from '../../components/sections/HomeSections';

const Home = () => {
  return (
    <>
      {/* Page SEO */}
      <SEO
        title="Celebrating Culture & Unity"
        description="A premium digital platform for Youth Organizations, Ganesh Utsav Committees, NGOs, Trusts, and Community Associations. Manage events, volunteer databases, and donor pipelines."
        keywords="community trust, ganesh utsav, volunteer dashboard, NGO software, youth committee, cultural festival"
      />

      {/* Hero Banner (100vh slider) */}
      <HeroBanner />

      {/* Home Page Sections */}
      <WelcomeSection />
      
      <AboutPreview />
      
      <FestivalHistoryPreview />
      
      <UpcomingEvents />
      
      <CommitteePreview />
      
      <GalleryPreview />
      
      <Sponsors />
      
      <VolunteerCTA />
      
      <DonationCTA />
      
      <LatestNewsPreview />
      
      <ContactPreview />
    </>
  );
};

export default Home;
