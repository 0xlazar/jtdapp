# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- PWA (Progressive Web App) support
  - Added manifest.json with app configuration
  - Added service worker (sw.js) for offline functionality
  - Added PWA meta tags in index.html
  - Added app icons (192x192 and 512x512)
  - Added service worker registration in main.js

### Changed
- Modified event marker click behavior
  - Replaced default Leaflet popup with custom floating window
  - Added smooth transition animations for the popup
  - Improved popup positioning to appear above footer
  - Added proper z-index layering to ensure footer is always clickable
  - Added pointer-events handling to prevent interaction with hidden popup

### Technical Details
- Added CSS classes for popup transitions:
  - `transition-all` for smooth animations
  - `opacity-0` for fade effects
  - `pointer-events-none` for proper interaction handling
- Updated z-index values:
  - Footer: z-40 (highest)
  - Popup: z-30
  - Map UI elements: z-20
  - Map: z-0

### Files Modified
- index.html
  - Added PWA meta tags
  - Added manifest link
  - Added apple-touch-icon link
  - Updated popup HTML structure
  - Updated z-index values
- scripts/main.js
  - Added service worker registration
  - Modified marker click handler
  - Added popup show/hide logic
- manifest.json (new)
  - Added PWA configuration
  - Added icon definitions
- sw.js (new)
  - Added service worker implementation
  - Added cache configuration
  - Added offline support
- icons/ (new directory)
  - Added icon-192x192.png
  - Added icon-512x512.png

### Next Steps
- Consider adding more PWA features:
  - Push notifications
  - Background sync
  - More offline capabilities
- Consider adding more interactive features to the popup:
  - Share button
  - Add to calendar
  - Save to favorites 