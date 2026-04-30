import { useEffect, useRef } from "react";

// Read from environment variables
const GTM_ID = import.meta.env.VITE_GTM_ID;
const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const GOOGLE_ADS_CONVERSION_ID = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
const FACEBOOK_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
const COOKIEBOT_ID = import.meta.env.VITE_COOKIEBOT_ID;

/**
 * Injects all third-party tracking scripts with proper GDPR compliance.
 *
 * Script loading order:
 * 1. Google Consent Mode v2 defaults (denies all by default)
 * 2. Cookiebot (consent management UI)
 * 3. GTM (if configured) OR standalone gtag.js (fallback)
 *
 * Consent flow:
 * - All tracking starts as 'denied'
 * - Cookiebot events update consent state when user interacts
 * - GTM/gtag respects consent state automatically
 */
export function ThirdPartyScripts() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization (React StrictMode)
    if (initialized.current) return;
    initialized.current = true;

    // Initialize dataLayer immediately (must exist before any gtag calls)
    window.dataLayer = window.dataLayer || [];

    // Define gtag function globally
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    }
    window.gtag = gtag;

    // 1. Set Consent Mode v2 defaults FIRST (GDPR: deny all by default)
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });

    // Enable URL passthrough for better conversion attribution when cookies denied
    gtag("set", "url_passthrough", true);

    // Redact ads data when consent is denied
    gtag("set", "ads_data_redaction", true);

    // 2. Set up Cookiebot consent event handlers
    const handleCookiebotAccept = () => {
      if (typeof window.gtag === "function" && window.Cookiebot) {
        window.gtag("consent", "update", {
          ad_storage: window.Cookiebot.consent.marketing ? "granted" : "denied",
          ad_user_data: window.Cookiebot.consent.marketing ? "granted" : "denied",
          ad_personalization: window.Cookiebot.consent.marketing ? "granted" : "denied",
          analytics_storage: window.Cookiebot.consent.statistics ? "granted" : "denied",
          functionality_storage: window.Cookiebot.consent.preferences ? "granted" : "denied",
          personalization_storage: window.Cookiebot.consent.preferences ? "granted" : "denied",
        });
      }
    };

    const handleCookiebotDecline = () => {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
          functionality_storage: "denied",
          personalization_storage: "denied",
        });
      }
    };

    // Handle returning visitors who already gave consent
    const handleCookiebotLoad = () => {
      if (window.Cookiebot?.consented) {
        handleCookiebotAccept();
      }
    };

    window.addEventListener("CookiebotOnAccept", handleCookiebotAccept);
    window.addEventListener("CookiebotOnDecline", handleCookiebotDecline);
    window.addEventListener("CookiebotOnLoad", handleCookiebotLoad);

    // 3. Inject Cookiebot script (loads the consent banner)
    if (COOKIEBOT_ID) {
      const cookiebotScript = document.createElement("script");
      cookiebotScript.id = "Cookiebot";
      cookiebotScript.src = "https://consent.cookiebot.com/uc.js";
      cookiebotScript.setAttribute("data-cbid", COOKIEBOT_ID);
      // Note: We don't use auto-blocking since we handle consent via Consent Mode v2
      cookiebotScript.type = "text/javascript";
      document.head.appendChild(cookiebotScript);
    }

    // 4. Inject tracking scripts
    if (GTM_ID) {
      // GTM mode: GTM manages all tags (GA4, Google Ads, FB Pixel, etc.)
      injectGTM(GTM_ID);
    } else if (GOOGLE_ANALYTICS_ID) {
      // Fallback mode: Use standalone gtag.js when GTM is not configured
      injectStandaloneGtag(GOOGLE_ANALYTICS_ID, GOOGLE_ADS_CONVERSION_ID);
    }

    // 5. Inject Facebook Pixel if configured and not using GTM
    if (!GTM_ID && FACEBOOK_PIXEL_ID) {
      injectFacebookPixel(FACEBOOK_PIXEL_ID);
    }

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("CookiebotOnAccept", handleCookiebotAccept);
      window.removeEventListener("CookiebotOnDecline", handleCookiebotDecline);
      window.removeEventListener("CookiebotOnLoad", handleCookiebotLoad);
    };
  }, []);

  return null;
}

/**
 * Injects Google Tag Manager container
 */
function injectGTM(gtmId: string) {
  // GTM head script - inject at beginning of head for earliest possible loading
  const gtmScript = document.createElement("script");
  gtmScript.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(gtmScript);

  // GTM noscript iframe - insert at beginning of body
  const noscript = document.createElement("noscript");
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.cssText = "display:none;visibility:hidden";
  noscript.appendChild(iframe);

  // Insert as first child of body (after React root if it exists)
  if (document.body.firstChild) {
    document.body.insertBefore(noscript, document.body.firstChild);
  } else {
    document.body.appendChild(noscript);
  }
}

/**
 * Injects standalone gtag.js for GA4 and Google Ads (fallback when GTM not used)
 */
function injectStandaloneGtag(gaId: string, adsId?: string) {
  // Load gtag.js library
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gtagScript);

  // Initialize after library loads
  gtagScript.onload = () => {
    if (typeof window.gtag === "function") {
      window.gtag("js", new Date());
      window.gtag("config", gaId, { anonymize_ip: true });
      if (adsId) {
        window.gtag("config", adsId);
      }
    }
  };
}

/**
 * Injects Facebook Pixel (only used when GTM is not configured)
 */
function injectFacebookPixel(pixelId: string) {
  const fbScript = document.createElement("script");
  fbScript.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(fbScript);

  // Add noscript fallback
  const noscript = document.createElement("noscript");
  const img = document.createElement("img");
  img.height = 1;
  img.width = 1;
  img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    Cookiebot?: {
      consent: {
        marketing: boolean;
        statistics: boolean;
        preferences: boolean;
        necessary: boolean;
      };
      consented: boolean;
    };
    fbq?: (...args: unknown[]) => void;
  }
}
