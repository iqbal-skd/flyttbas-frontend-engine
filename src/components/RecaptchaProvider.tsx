import { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface RecaptchaProviderProps {
  children: ReactNode;
}

/**
 * Wrapper component that provides reCAPTCHA v3 to the entire app
 * Must be placed at the root level of your application
 */
export const RecaptchaProvider = ({ children }: RecaptchaProviderProps) => {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    console.warn(
      "reCAPTCHA site key is not configured. Please add VITE_RECAPTCHA_SITE_KEY to your .env file"
    );
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};
