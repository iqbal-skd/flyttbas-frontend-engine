// Type definitions for Google Tag Manager

declare global {
  interface Window {
    dataLayer?: (Record<string, any> | ((dataLayer: any[]) => void))[];
  }
}

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
