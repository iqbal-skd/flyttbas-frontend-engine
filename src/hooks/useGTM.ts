// Hook for Google Tag Manager integration
export const useGTM = () => {
  // Push page view event to GTM data layer
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "pageview",
        page: {
          path: pagePath,
          title: pageTitle || document.title,
        },
      });
    }
  };

  // Push custom events to GTM
  const trackEvent = (
    eventName: string,
    eventData?: Record<string, any>
  ) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventData,
      });
    }
  };

  // Push e-commerce event (e.g., form submission, purchase)
  const trackConversion = (data: Record<string, any>) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "conversion",
        ...data,
      });
    }
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion,
  };
};
