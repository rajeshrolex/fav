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

// Admin placeholders
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));

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
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: '', element: <AdminDashboard /> },
        { path: 'events', element: <AdminDashboard /> }, // maps to dashboard placeholder for simplicity
        { path: 'volunteers', element: <AdminDashboard /> },
        { path: 'donations', element: <AdminDashboard /> },
        { path: 'sponsors', element: <AdminDashboard /> },
        { path: 'settings', element: <AdminDashboard /> },
      ]
    }
  ]);
}
