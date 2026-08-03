import React, { useState, useEffect } from 'react';
import SEO from '../../components/seo/SEO';
import HeroBanner from '../../components/hero/HeroBanner';
import { useConfig } from '../../context/ConfigContext';
import api from '../../services/api';
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
  const { settings, trackVisit } = useConfig();
  
  // Data States
  const [seo, setSeo] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [events, setEvents] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState([]);

  // Track page hit and fetch homepage data
  useEffect(() => {
    trackVisit();

    const fetchHomeData = async () => {
      try {
        // Load page SEO
        const seoRes = await api.get('/settings.php', { params: { action: 'seo', page: 'home' } });
        if (seoRes.success && seoRes.data) {
          setSeo(seoRes.data);
        }
        
        // Load statistics from about/settings
        const aboutRes = await api.get('/about.php');
        if (aboutRes.success && aboutRes.data) {
          setTimeline(aboutRes.data.timeline || []);
          
          // Reconstruct stats dynamically from settings if available
          const dbSettings = aboutRes.data.details;
          const statisticsData = [
            { value: dbSettings.stat_legacy_value || '25+', label: dbSettings.stat_legacy_label || 'Years of Legacy' },
            { value: dbSettings.stat_committee_value || '150+', label: dbSettings.stat_committee_label || 'Active Committee Members' },
            { value: dbSettings.stat_volunteers_value || '2,500+', label: dbSettings.stat_volunteers_label || 'Registered Volunteers' },
            { value: dbSettings.stat_attendees_value || '50K+', label: dbSettings.stat_attendees_label || 'Annual Attendees' }
          ];
          setStats(statisticsData);
        }

        // Load Events
        const eventsRes = await api.get('/events.php');
        if (eventsRes.success && eventsRes.data) {
          setEvents(eventsRes.data);
        }

        // Load Committee
        const commRes = await api.get('/committee.php');
        if (commRes.success && commRes.data) {
          setCommittee(commRes.data);
        }

        // Load Gallery
        const galRes = await api.get('/gallery.php');
        if (galRes.success && galRes.data) {
          setGallery(galRes.data);
        }

        // Load Sponsors
        const spRes = await api.get('/sponsors.php');
        if (spRes.success && spRes.data) {
          setSponsors(spRes.data);
        }

        // Load News
        const newsRes = await api.get('/news.php');
        if (newsRes.success && newsRes.data) {
          setNews(newsRes.data);
        }

      } catch (err) {
        console.error('Error fetching Home CMS data:', err);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <>
      {/* Page SEO (fully dynamic based on CMS definitions) */}
      <SEO
        title={seo?.meta_title || "Celebrating Culture & Unity"}
        description={seo?.meta_description || "A premium digital platform for Youth Organizations, Ganesh Utsav Committees, NGOs, Trusts, and Community Associations."}
        keywords={seo?.meta_keywords || "community trust, ganesh utsav, volunteer dashboard, NGO software"}
        ogTitle={seo?.og_title}
        ogDescription={seo?.og_description}
        ogImage={seo?.og_image}
        twitterTitle={seo?.twitter_title}
        twitterDescription={seo?.twitter_description}
        twitterImage={seo?.twitter_image}
      />

      {/* Hero Banner (100vh slider) */}
      <HeroBanner />

      {/* Dynamic Home Page Sections */}
      <WelcomeSection stats={stats} settings={settings || {}} />
      
      <AboutPreview settings={settings || {}} />
      
      <FestivalHistoryPreview timeline={timeline} />
      
      <UpcomingEvents events={events} />
      
      <CommitteePreview members={committee} />
      
      <GalleryPreview items={gallery} />
      
      <Sponsors list={sponsors} />
      
      <VolunteerCTA />
      
      <DonationCTA />
      
      <LatestNewsPreview news={news} />
      
      <ContactPreview settings={settings || {}} />
    </>
  );
};

export default Home;
