const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for vector icon fonts
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db',
  // Vector icon font files
  'ttf',
  'otf',
  'woff',
  'woff2'
);

module.exports = config;
