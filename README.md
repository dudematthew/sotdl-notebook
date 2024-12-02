# SotDL Spellbook

A digital companion for Shadow of the Demon Lord spellcasting. This mobile app helps you manage and organize your spells with features like OCR-based spell scanning, offline storage, and easy import/export functionality.

## Features

### Core Features
- **Spell Management**
  - Add, edit, view, and delete spells
  - Search and filter spells by title, description, tradition, or tags
  - Organize spells by tradition and level
  - Support for both English and Polish languages

### Coming Soon
- **OCR Integration**
  - Scan spells from physical books
  - Smart boundary detection for spell sections
  - Manual boundary adjustment
  - Support for multiple languages (English/Polish)

- **Image Management**
  - Attach original spell images
  - View scanned spell sources
  - Manage multiple images per spell

- **Data Management**
  - Import/Export spells as JSON
  - Local storage with offline access
  - Backup and restore functionality

## Technology Stack

- React with TypeScript
- Ionic Framework for UI components
- Capacitor for native functionality
- Local storage using Capacitor Preferences

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sotdl-spellbook.git
   cd sotdl-spellbook
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm start
   ```

### Building for Mobile

#### Android
```bash
# Build the web assets
pnpm build

# Sync the assets with the native project
pnpm cap sync

# Open in Android Studio
pnpm cap open android
```

#### iOS (macOS only)
```bash
# Build the web assets
pnpm build

# Sync the assets with the native project
pnpm cap sync

# Open in Xcode
pnpm cap open ios
```

## Development Commands

- `pnpm start` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm run build:android` - Build Android app
- `pnpm run build:ios` - Build iOS app
- `pnpm run run:android` - Run on Android device/emulator
- `pnpm run run:ios` - Run on iOS simulator

## Project Structure

```
src/
├── features/
│   └── spells/              # Spell management feature
│       ├── components/      # Reusable spell components
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Spell-related pages
│       ├── types/          # TypeScript types
│       └── utils/          # Utility functions
├── components/             # Shared components
├── pages/                  # Main app pages
└── theme/                  # Theme configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Shadow of the Demon Lord is a trademark of Schwalb Entertainment, LLC.
- This app is a fan-made tool and is not officially affiliated with Schwalb Entertainment.
