import { isTrackingEnabled } from "@/lib/environment";

// Google Ads Conversion Tracking utilities

const GOOGLE_ADS_CONVERSION_ID = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
const QUOTE_FORM_CONVERSION_LABEL = import.meta.env.VITE_GOOGLE_ADS_QUOTE_CONVERSION_LABEL;

/**
 * Track Google Ads conversion for quote form submission.
 * Works with both GTM (via dataLayer) and standalone gtag.js.
 *
 * When using GTM: The conversion is also pushed to dataLayer for GTM triggers.
 * When using gtag.js: The conversion is sent directly via gtag().
 */
export function trackQuoteFormConversion() {
  if (!isTrackingEnabled) {
    return;
  }

  if (!GOOGLE_ADS_CONVERSION_ID || !QUOTE_FORM_CONVERSION_LABEL) {
    console.warn("Google Ads conversion tracking not configured");
    return;
  }

  // Push to dataLayer for GTM (GTM will pick this up if configured)
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "quote_form_conversion",
      conversionId: GOOGLE_ADS_CONVERSION_ID,
      conversionLabel: QUOTE_FORM_CONVERSION_LABEL,
    });
  }

  // Also call gtag directly for standalone mode
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_CONVERSION_ID}/${QUOTE_FORM_CONVERSION_LABEL}`,
    });
  }
}
