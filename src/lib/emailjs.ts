// EmailJS keys come from .env (VITE_APP_EMAILJS_*); they are public by design.
const env = import.meta.env;

export const emailjsConfig = {
  serviceId: env.VITE_APP_EMAILJS_SERVICE_ID,
  templateId: env.VITE_APP_EMAILJS_TEMPLATE_ID,
  publicKey: env.VITE_APP_EMAILJS_PUBLIC_KEY,
};

/** The contact form only renders when all keys are configured. */
export const contactFormEnabled = Boolean(
  emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey,
);
