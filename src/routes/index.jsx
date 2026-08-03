import React, { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Lazy Loaded Pages
const Home = lazy(() => import('../pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const Committee = lazy(() => import('../pages/Committee/Committee'));
const FestivalHistory = lazy(() => import('../pages/FestivalHistory/FestivalHistory'));
const Events = lazy(() => import('../pages/Events/Events'));
const Gallery = lazy(() => import('../pages/Gallery/Gallery'));
const Sponsors = lazy(() => import('../pages/Sponsors/Sponsors'));
const Volunteer = lazy(() => import('../pages/Volunteer/Volunteer'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const News = lazy(() => import('../pages/News/News'));
const DynamicPage = lazy(() => import('../pages/DynamicPage/DynamicPage'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

// Admin Pages
const AdminLogin = lazy(() => import('../pages/Admin/Login'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const AdminHomeCMS = lazy(() => import('../pages/Admin/HomeCMS'));
const AdminAboutCMS = lazy(() => import('../pages/Admin/AboutCMS'));
const AdminCommittee = lazy(() => import('../pages/Admin/CommitteeAdmin'));
const AdminEvents = lazy(() => import('../pages/Admin/EventsAdmin'));
const AdminGallery = lazy(() => import('../pages/Admin/GalleryAdmin'));
const AdminSponsors = lazy(() => import('../pages/Admin/SponsorsAdmin'));
const AdminVolunteers = lazy(() => import('../pages/Admin/VolunteersAdmin'));
const AdminMessages = lazy(() => import('../pages/Admin/ContactAdmin'));
const AdminNews = lazy(() => import('../pages/Admin/NewsAdmin'));
const AdminMedia = lazy(() => import('../pages/Admin/MediaManager'));
const AdminSettings = lazy(() => import('../pages/Admin/SettingsAdmin'));

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '', element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'committee', element: <Committee /> },
        { path: 'festival-history', element: <FestivalHistory /> },
        { path: 'events', element: <Events /> },
        { path: 'gallery', element: <Gallery /> },
        { path: 'sponsors', element: <Sponsors /> },
        { path: 'volunteer', element: <Volunteer /> },
        { path: 'contact', element: <Contact /> },
        { path: 'news', element: <News /> },
        { path: 'pages/:slug', element: <DynamicPage /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/admin-login',
      element: <AdminLogin />
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: '', element: <AdminDashboard /> },
        { path: 'home', element: <AdminHomeCMS /> },
        { path: 'about', element: <AdminAboutCMS /> },
        { path: 'committee', element: <AdminCommittee /> },
        { path: 'events', element: <AdminEvents /> },
        { path: 'gallery', element: <AdminGallery /> },
        { path: 'sponsors', element: <AdminSponsors /> },
        { path: 'volunteers', element: <AdminVolunteers /> },
        { path: 'messages', element: <AdminMessages /> },
        { path: 'news', element: <AdminNews /> },
        { path: 'media', element: <AdminMedia /> },
        { path: 'settings', element: <AdminSettings /> },
        { path: '*', element: <Navigate to="/admin" replace /> }
      ]
    }
  ]);
}
