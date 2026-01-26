// Type definitions for Google Tag Manager

// Note: Window.dataLayer is declared in ThirdPartyScripts.tsx
// This file only exports GTM-related interfaces

export interface GTMPageView {
  event: "pageview";
  page: {
    path: string;
    title: string;
  };
}

export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export interface GTMConversion {
  event: "conversion";
  [key: string]: any;
}

export type GTMDataLayerItem = GTMPageView | GTMEvent | GTMConversion;
