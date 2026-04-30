import { useEffect, useRef } from "react";

// Read from environment variables
const GTM_ID = import.meta.env.VITE_GTM_ID;
const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const GOOGLE_ADS_CONVERSION_ID = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
const FACEBOOK_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
const COOKIEBOT_ID = import.meta.env.VITE_COOKIEBOT_ID;

/**
 * Injects third-party tracking scripts with GDPR compliance.
 *
 * NOTE: Google Consent Mode v2 defaults are set in index.html to ensure
 * they execute BEFORE any tracking scripts load. This component handles:
 * - Cookiebot (consent UI + consent state updates)
 * - GTM or standalone gtag.js
 * - Facebook Pixel (if not using GTM)
 */
export function ThirdPartyScripts() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Set up Cookiebot consent event handlers
    setupCookiebotHandlers();

    // Inject Cookiebot script (consent banner)
    if (COOKIEBOT_ID) {
      injectCookiebot(COOKIEBOT_ID);
    }

    // Inject tracking scripts
    // Consent defaults are already set in index.html, so cookies won't be set
    if (GTM_ID) {
      injectGTM(GTM_ID);
    } else if (GOOGLE_ANALYTICS_ID) {
      injectStandaloneGtag(GOOGLE_ANALYTICS_ID, GOOGLE_ADS_CONVERSION_ID);
    }

    // Facebook Pixel (only if not using GTM)
    if (!GTM_ID && FACEBOOK_PIXEL_ID) {
      injectFacebookPixel(FACEBOOK_PIXEL_ID);
    }

    return () => {
      cleanupCookiebotHandlers();
    };
  }, []);

  return null;
}

/**
 * Cookiebot event handler references (for cleanup)
 */
let cookiebotAcceptHandler: (() => void) | null = null;
let cookiebotDeclineHandler: (() => void) | null = null;
let cookiebotLoadHandler: (() => void) | null = null;

function setupCookiebotHandlers() {
  cookiebotAcceptHandler = () => {
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

  cookiebotDeclineHandler = () => {
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

  cookiebotLoadHandler = () => {
    // Handle returning visitors who already gave/denied consent
    if (window.Cookiebot?.consented) {
      cookiebotAcceptHandler?.();
    }
  };

  window.addEventListener("CookiebotOnAccept", cookiebotAcceptHandler);
  window.addEventListener("CookiebotOnDecline", cookiebotDeclineHandler);
  window.addEventListener("CookiebotOnLoad", cookiebotLoadHandler);
}

function cleanupCookiebotHandlers() {
  if (cookiebotAcceptHandler) {
    window.removeEventListener("CookiebotOnAccept", cookiebotAcceptHandler);
  }
  if (cookiebotDeclineHandler) {
    window.removeEventListener("CookiebotOnDecline", cookiebotDeclineHandler);
  }
  if (cookiebotLoadHandler) {
    window.removeEventListener("CookiebotOnLoad", cookiebotLoadHandler);
  }
}

function injectCookiebot(cookiebotId: string) {
  const script = document.createElement("script");
  script.id = "Cookiebot";
  script.src = "https://consent.cookiebot.com/uc.js";
  script.setAttribute("data-cbid", cookiebotId);
  script.type = "text/javascript";
  document.head.appendChild(script);
}

function injectGTM(gtmId: string) {
  const gtmScript = document.createElement("script");
  gtmScript.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(gtmScript);

  // GTM noscript iframe (for users without JavaScript)
  const noscript = document.createElement("noscript");
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.cssText = "display:none;visibility:hidden";
  noscript.appendChild(iframe);

  if (document.body.firstChild) {
    document.body.insertBefore(noscript, document.body.firstChild);
  } else {
    document.body.appendChild(noscript);
  }
}

function injectStandaloneGtag(gaId: string, adsId?: string) {
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gtagScript);

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

  const noscript = document.createElement("noscript");
  const img = document.createElement("img");
  img.height = 1;
  img.width = 1;
  img.style.display = "none";
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
}

// TypeScript declarations
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
