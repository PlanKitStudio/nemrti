import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initFacebookPixel, fbqTrackPageView } from '@/lib/facebook-pixel';

/**
 * Facebook Pixel component — place inside <BrowserRouter>.
 * Initializes pixel on mount, tracks PageView on every route change.
 */
const FacebookPixel = () => {
  const location = useLocation();

  // Initialize pixel once on mount
  useEffect(() => {
    initFacebookPixel();
  }, []);

  // Track PageView on every route change
  useEffect(() => {
    fbqTrackPageView();
  }, [location.pathname]);

  return null; // This component renders nothing
};

export default FacebookPixel;
