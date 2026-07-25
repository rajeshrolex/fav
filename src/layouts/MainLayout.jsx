import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ScrollToTop, LoadingScreen } from '../components/common/CommonWidgets';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Widget */}
      <ScrollToTop />
    </Box>
  );
};

export default MainLayout;
