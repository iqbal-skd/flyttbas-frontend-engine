/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: "development" | "staging" | "production";
  readonly VITE_SUPABASE_PROJECT_ID: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_GOOGLE_ADS_CONVERSION_ID: string;
  readonly VITE_GOOGLE_ADS_QUOTE_CONVERSION_LABEL: string;
  readonly VITE_FACEBOOK_PIXEL_ID: string;
  readonly VITE_COOKIEBOT_ID: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
