# CRM Mobile App

A mobile CRM application built with Ionic React and Capacitor.

## Project Overview

This is a cross-platform mobile CRM application built using:

- Ionic React 8.0.0

- Capacitor 6.1.2

- React 18.2.0

- TypeScript

- Vite

## Prerequisites

- Node.js (LTS version)

- pnpm

- Android Studio & Android SDK (for Android development)

- Xcode (for iOS development, macOS only)

- Java JDK 17

## Environment Setup

### Android Development

- Install Android Studio

- Set ANDROID_HOME environment variable to your Android SDK location

- Create local.properties in android/ directory:

```properties
sdk.dir=C:\\Users\\<username>\\AppData\\Local\\Android\\Sdk
```

### iOS Development (macOS only)

- Install Xcode

- Install CocoaPods

- Run pod install in the ios/App directory

## Android Firebase Configuration

### google-services.json

For Firebase functionality (like Push Notifications), you need to add the `google-services.json` file:

1. Obtain `google-services.json` from your Firebase Console
2. Place it in the following location:

```
  android/app/google-services.json
```

3. This file should never be committed to version control (ensure it's in .gitignore)

If this file is missing, you'll see build errors related to Firebase configuration.

## Project Structure

Key configuration files:

- capacitor.config.ts - Main Capacitor configuration

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "crm-mobile",
  webDir: "dist",
};

export default config;
```

- ionic.config.json - Ionic project configuration

```json
{
  "name": "crm-mobile",
  "integrations": {
    "capacitor": {}
  },
  "type": "react-vite"
}
```

- Android configuration files:

- android/build.gradle - Project-level build configuration

- android/app/build.gradle - App-level build configuration

- android/variables.gradle - Android build variables

- iOS configuration:

- ios/App/Podfile - CocoaPods dependencies

## Live Updates

The app supports over-the-air (OTA) updates using Capacitor Live Update. This allows updating the web assets without requiring a full app store release.

### Configuration

1. The Live Update system is configured in:

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "crm-mobile",
  webDir: "dist",
};

export default config;
```

2. Updates are served from the CRM web server at `/live-updates/{channel}/`.

### Building and Deploying Updates

1. Create a new update package:

```bash
pnpm build:live-update
```

This will:

- Build the web assets
- Package them into a zip file
- Create a manifest file
- Deploy to the CRM web server's public directory

2. Test the update:

```bash
pnpm test-update
```

This builds an update package and runs it on an Android device for testing.

### Development Workflow

1. Start the CRM web server with tunneling:

```bash
cd ../crm-web
pnpm run dev:tunnel
```

2. Set your environment variables:

```bash
LIVE_UPDATE_URL=https://vcg-crm.loca.lt/live-updates
```

3. Build and test updates:

```bash
cd ../crm-mobile
pnpm test-update
```

### Update Channels

- Development channel: Used when NODE_ENV=development
- Production channel: Used when NODE_ENV=production

Updates are versioned and stored separately for each channel.

### Notes

- Updates are automatically downloaded in the background
- The app checks for updates on launch
- Maximum of 2 versions are kept in storage
- Updates are applied on next app launch
- The web server must be running to serve updates

## Available Scripts

Key commands:

### Development

- `pnpm start` - Start development server (alias for pnpm run dev)
- `pnpm dev` - Start development server with hot reload
- `pnpm preview` - Preview production build locally

### Building

- `pnpm build` - Build web assets for production
- `pnpm build:dev` - Build web assets for development
- `pnpm build:prod` - Build web assets for production with optimizations
- `pnpm build:android` - Build Android app (includes Capacitor sync)
- `pnpm build:ios` - Build iOS app (includes Capacitor sync)
- `pnpm build:all` - Build both Android and iOS apps

### Running on Devices

- `pnpm run:android` - Run on Android device/emulator
- `pnpm run:ios` - Run on iOS simulator
- `pnpm run:android:dev` - Build in development mode and run on Android
- `pnpm run:android:prod` - Build in production mode and run on Android

### Deployment

- `pnpm deploy:android` - Build and deploy Android app
- `pnpm deploy:ios` - Build and deploy iOS app

### Testing

- `pnpm test.e2e` - Run end-to-end tests with Cypress
- `pnpm test.unit` - Run unit tests with Vitest
- `pnpm lint` - Run ESLint for code quality

### Capacitor

- `pnpm sync` - Sync web assets with native platforms
- `pnpm open` - Open native IDE (Android Studio/Xcode)

## Error Tracking with Sentry

The project uses Sentry for error tracking and monitoring. Key features include:

- Automatic error capturing and reporting
- Session replay for debugging
- Performance monitoring
- Custom error boundaries with detailed reporting

### Configuration

1. Set up your Sentry DSN in environment variables:

```bash
VITE_SENTRY_DSN=your-sentry-dsn
```

2. Sentry is initialized in `src/utils/sentry.ts` with the following features:
   - Browser tracing for performance monitoring
   - Session replay for error reproduction
   - Environment-based configuration
   - Custom error sampling rates

### Testing Sentry Integration

A test page is available at `/sentry-test` that allows you to:

- Trigger test errors
- Send test messages
- Create performance transactions
- Test error boundary behavior

### Development Notes

- Sentry is enabled in both development and production
- Development mode includes additional console logging
- The DetailedErrorBoundary component provides enhanced error reporting
- Error reports include:
  - Component stack traces
  - Environment information
  - User context when available

### Related Files

Key files for Sentry integration:

- `src/utils/sentry.ts` - Main Sentry configuration
- `src/components/DetailedErrorBoundary.tsx` - Enhanced error boundary
- `src/pages/functions/SentryTest.tsx` - Test page for Sentry features
- `capacitor.config.ts` - Native platform Sentry configuration

## Development Notes

- Always run npx cap sync after:

- Installing new plugins

- Building web assets

- Making changes to capacitor.config.ts

- Android SDK Configuration:

- Minimum SDK: 22

- Target SDK: 34

- Compile SDK: 34

- iOS Configuration:

- Minimum iOS version: 13.0

- Uses CocoaPods for dependency management

## Development with Tunneling

When developing locally with a physical device, you'll need to set up tunneling to allow the device to communicate with your development server:

1. First, start the CRM web server with tunneling:

```bash
cd ../crm-web
pnpm run dev:tunnel
```

2. The tunnel URL will be displayed (e.g., https://vcg-crm.loca.lt)

3. Update your mobile environment configuration:

   - Set VITE_PUBLIC_CRM_API_DEV_URL to the tunnel URL + '/api/trpc'
   - Example: https://vcg-crm.loca.lt/api/trpc

4. Start the mobile development server:

```bash
pnpm run dev
```

### Tunneling Notes

- The web tunnel must be started before running the mobile app
- The tunnel URL is consistent thanks to the fixed subdomain (vcg-crm)
- If the tunnel fails to start, ensure port 3000 is available

## Common Issues

- Android SDK Location:

- If build fails with SDK location error, verify local.properties file

- Ensure ANDROID_HOME environment variable is set correctly

- iOS Build Issues:

- Run pod install in ios/App directory

- Clean build folder in Xcode if needed

## Contributing

- Ensure all web assets are built before mobile builds

- Test on both Android and iOS when possible

- Keep capacitor.config.ts and native platform configurations in sync

## Build Modes and Development

The application supports different build modes:

- `pnpm build:dev` - Build the app in development mode
- `pnpm build:prod` - Build the app in production mode
- `pnpm run:android:dev` - Build in development mode and run on Android
- `pnpm run:android:prod` - Build in production mode and run on Android

### Environment Indicators

The app includes visual indicators to show which environment you're running in:

- Development builds show a warning banner
- Production builds run without environment indicators

### Development Tips

When developing locally:

1. Use `pnpm run dev` for rapid web development
2. Use `pnpm run:android:dev` for testing on Android devices with development features
3. Use `pnpm run:android:prod` for testing production builds before deployment

For production deployments, always use:

- `pnpm build:prod` for web builds
- `pnpm run:android:prod` for Android builds
