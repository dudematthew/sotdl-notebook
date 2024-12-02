import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url(),
  COGNITO_CLIENT_ID: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
  COGNITO_USER_POOL_ENDPOINT: z.string().url(),
  COGNITO_TEST_USERNAME: z.string().optional(),
  COGNITO_TEST_PASSWORD: z.string().optional(),
  SENTRY_DSN: z.string().url(),
});

const processEnv = {
  API_URL: import.meta.env.DEV
    ? import.meta.env.VITE_PUBLIC_CRM_API_DEV_URL
    : import.meta.env.VITE_PUBLIC_CRM_API_BASE_URL,
  COGNITO_CLIENT_ID: import.meta.env.VITE_COGNITO_CLIENT_ID,
  COGNITO_USER_POOL_ID: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_ENDPOINT: import.meta.env.VITE_COGNITO_USER_POOL_ENDPOINT,
  COGNITO_TEST_USERNAME: import.meta.env.VITE_COGNITO_TEST_USERNAME,
  COGNITO_TEST_PASSWORD: import.meta.env.VITE_COGNITO_TEST_PASSWORD,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
