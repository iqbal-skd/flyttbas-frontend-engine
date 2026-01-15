import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

// Read from environment variables
const GOOGLE_ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const FACEBOOK_PIXEL_ID = import.meta.env.VITE_FACEBOOK_PIXEL_ID;
const COOKIEBOT_ID = import.meta.env.VITE_COOKIEBOT_ID;

export function ThirdPartyScripts() {
  const cookiebotInjected = useRef(false);
  const gaInjected = useRef(false);
  const fbInjected = useRef(false);

  // Inject Cookiebot (needs to load first for consent management)
  useEffect(() => {
    if (cookiebotInjected.current || !COOKIEBOT_ID) return;

    const script = document.createElement("script");
    script.id = "Cookiebot";
    script.src = "https://consent.cookiebot.com/uc.js";
    script.setAttribute("data-cbid", COOKIEBOT_ID);
    script.setAttribute("data-blockingmode", "auto");
    script.type = "text/javascript";
    document.head.insertBefore(script, document.head.firstChild);
    cookiebotInjected.current = true;
  }, []);

  // Inject Google Analytics
  useEffect(() => {
    if (gaInjected.current || !GOOGLE_ANALYTICS_ID) return;

    // Load gtag.js
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    gtagScript.setAttribute("data-cookieconsent", "statistics");
    document.head.appendChild(gtagScript);

    // Initialize gtag
    const initScript = document.createElement("script");
    initScript.setAttribute("data-cookieconsent", "statistics");
    initScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GOOGLE_ANALYTICS_ID}', { 'anonymize_ip': true });
    `;
    document.head.appendChild(initScript);
    gaInjected.current = true;
  }, []);

  // Inject Facebook Pixel
  useEffect(() => {
    if (fbInjected.current || !FACEBOOK_PIXEL_ID) return;

    const fbScript = document.createElement("script");
    fbScript.setAttribute("data-cookieconsent", "marketing");
    fbScript.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FACEBOOK_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);

    // Add noscript fallback
    const noscript = document.createElement("noscript");
    const img = document.createElement("img");
    img.height = 1;
    img.width = 1;
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);

    fbInjected.current = true;
  }, []);

  return null;
}
