import React, { useRef, forwardRef, useImperativeHandle } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const RecaptchaBox = forwardRef(({ onTokenChange }, ref) => {
  const recaptchaRef = useRef();

  useImperativeHandle(ref, () => ({
    resetCaptcha: () => recaptchaRef.current?.reset(),
  }));

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn("VITE_RECAPTCHA_SITE_KEY not found in environment variables");
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-sm">
        Warning: reCAPTCHA not configured. Please set VITE_RECAPTCHA_SITE_KEY in
        your .env file.
      </div>
    );
  }

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={siteKey}
      onChange={(token) => onTokenChange(token)}
    />
  );
});

export default RecaptchaBox;
