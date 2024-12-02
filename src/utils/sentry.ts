import * as Sentry from "@sentry/react";
import { Replay } from "@sentry/replay";
import { BrowserTracing } from "@sentry/tracing";

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        tracingOrigins: ["localhost", /^https:\/\/[^/]+/],
      }),
      new Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // TODO: Disable Sentry in development
    enabled: true, // import.meta.env.PROD,
    debug: import.meta.env.DEV,
    environment: import.meta.env.MODE,
    release: `crm-mobile@${import.meta.env.VITE_APP_VERSION || "1.0.0"}`,
    beforeSend(event) {
      // Log events in development but still send them
      if (import.meta.env.DEV) {
        console.log("Sentry event in development:", event);
      }
      return event;
    },
  });
};
