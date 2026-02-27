// Google Ads Conversion Tracking utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GOOGLE_ADS_CONVERSION_ID = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
const QUOTE_FORM_CONVERSION_LABEL = import.meta.env.VITE_GOOGLE_ADS_QUOTE_CONVERSION_LABEL;

/**
 * Track Google Ads conversion for quote form submission
 */
export function trackQuoteFormConversion() {
  if (!window.gtag || !GOOGLE_ADS_CONVERSION_ID || !QUOTE_FORM_CONVERSION_LABEL) {
    console.warn('Google Ads conversion tracking not configured');
    return;
  }

  window.gtag('event', 'conversion', {
    'send_to': `${GOOGLE_ADS_CONVERSION_ID}/${QUOTE_FORM_CONVERSION_LABEL}`,
  });
}
