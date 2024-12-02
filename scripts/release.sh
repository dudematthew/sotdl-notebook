#!/bin/bash

# Check if type is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <type>"
  echo "Available types:"
  echo "  beta   - Create beta release from develop branch"
  echo "  prod   - Create patch release from main branch"
  echo "  minor  - Create minor release from main branch"
  echo "  major  - Create major release from main branch"
  exit 1
fi

TYPE="$1"

# Validate release type
if [ "$TYPE" != "beta" ] && [ "$TYPE" != "prod" ] && [ "$TYPE" != "minor" ] && [ "$TYPE" != "major" ]; then
  echo "Invalid release type. Use 'beta', 'prod', 'minor', or 'major'"
  exit 1
fi

# Create release based on type
case $TYPE in
  "beta")
    echo "Creating beta release..."
    pnpm release:beta
    ;;
  "prod")
    echo "Creating production patch release..."
    pnpm release:prod
    ;;
  "minor")
    echo "Creating minor release..."
    pnpm release:minor
    ;;
  "major")
    echo "Creating major release..."
    pnpm release:major
    ;;
esac

echo "Release created. GitHub Actions will now build and publish the release."