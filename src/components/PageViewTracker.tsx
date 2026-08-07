import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGTM } from "@/hooks/useGTM";
import { isTrackingEnabled } from "@/lib/environment";

/**
 * PageViewTracker component that automatically tracks page views
 * when the route changes in the SPA. Place this component at the
 * root level (inside BrowserRouter).
 */
export const PageViewTracker = () => {
  const location = useLocation();
  const { trackPageView } = useGTM();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isTrackingEnabled) {
      trackPageView(location.pathname, document.title);
    }
  }, [location.pathname, trackPageView]);

  return null; // This component doesn't render anything
};
