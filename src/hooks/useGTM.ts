import { isTrackingEnabled } from "@/lib/environment";

/**
 * Hook for Google Tag Manager / dataLayer integration.
 *
 * Provides methods to push events to the dataLayer which GTM can use
 * to trigger tags. These methods are safe to call even if GTM hasn't
 * loaded yet - events will queue in the dataLayer.
 */
export const useGTM = () => {
  /**
   * Ensures dataLayer exists and returns it
   */
  const getDataLayer = (): unknown[] => {
    if (!isTrackingEnabled || typeof window === "undefined") return [];
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  };

  /**
   * Push page view event to GTM dataLayer
   */
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    getDataLayer().push({
      event: "pageview",
      page: {
        path: pagePath,
        title: pageTitle || (typeof document !== "undefined" ? document.title : ""),
      },
    });
  };

  /**
   * Push custom event to GTM dataLayer
   */
  const trackEvent = (eventName: string, eventData?: Record<string, unknown>) => {
    getDataLayer().push({
      event: eventName,
      ...eventData,
    });
  };

  /**
   * Push conversion event to GTM dataLayer
   */
  const trackConversion = (data: Record<string, unknown>) => {
    getDataLayer().push({
      event: "conversion",
      ...data,
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion,
  };
};
