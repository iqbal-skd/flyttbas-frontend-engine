import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

/**
 * Custom hook for handling reCAPTCHA v3 token generation
 * Returns a function to execute reCAPTCHA with a specific action
 */
export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = useCallback(
    async (action: string = "submit"): Promise<string | null> => {
      if (!executeRecaptcha) {
        console.warn("reCAPTCHA not ready");
        return null;
      }

      try {
        const token = await executeRecaptcha(action);
        return token;
      } catch (error) {
        console.error("reCAPTCHA token generation failed:", error);
        return null;
      }
    },
    [executeRecaptcha]
  );

  return { getRecaptchaToken };
};
