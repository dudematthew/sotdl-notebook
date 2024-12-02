import type { CapacitorConfig } from "@capacitor/cli";
import { env } from "./src/capacitor-env";

const config: CapacitorConfig = {
  appId: "com.sotdl.notebook",
  appName: "SotDL Notebook",
  webDir: "dist",
  plugins: {
    LiveUpdate: {
      appId: "sotdl-notebook",
      channel: process.env.NODE_ENV === "development" ? "development" : "production",
      autoUpdateMethod: "background",
      maxVersions: 2,
      distributionUrl: env.LIVE_UPDATE_URL,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    SentryCapacitor: {
      dsn: env.SENTRY_DSN,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
    },
  },
};

export default config;
