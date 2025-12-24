import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGTM } from "@/hooks/useGTM";

/**
 * PageViewTracker component that automatically tracks page views
 * when the route changes in the SPA. Place this component at the
 * root level (inside BrowserRouter).
 */
export const PageViewTracker = () => {
  const location = useLocation();
  const { trackPageView } = useGTM();

  useEffect(() => {
    // Track page view whenever the location changes
    trackPageView(location.pathname, document.title);
  }, [location.pathname, trackPageView]);

  return null; // This component doesn't render anything
};
