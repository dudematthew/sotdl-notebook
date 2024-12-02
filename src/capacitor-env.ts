import { z } from "zod";

const capacitorEnvSchema = z.object({
  SENTRY_DSN: z.string(),
  LIVE_UPDATE_URL: z.string().url(),
});

const getEnvConfig = () => {
  const config = {
    SENTRY_DSN: process.env.SENTRY_DSN || "",
    LIVE_UPDATE_URL: import.meta.env.DEV
      ? import.meta.env.VITE_LIVE_UPDATE_DEV_URL
      : import.meta.env.VITE_LIVE_UPDATE_PROD_URL,
  };

  const parsed = capacitorEnvSchema.safeParse(config);

  if (!parsed.success) {
    console.error("❌ Invalid Capacitor environment variables:", JSON.stringify(parsed.error.format(), null, 2));
    throw new Error("Invalid Capacitor environment variables");
  }

  return parsed.data;
};

export const env = getEnvConfig();
