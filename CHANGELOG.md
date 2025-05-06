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
- Added "Coming Soon" popup for Profile section
- Added Telegram community link in footer
- Ecosystem Hub section with:
  - Latest Updates section
  - Host Your Event information
  - Active Grants section
  - Interactive popup interface
  - Community Support section
- Welcome popup for first-time visitors:
  - First-visit detection using localStorage
  - Community-focused messaging
  - Clear value proposition
  - Interactive close buttons
- List View functionality:
  - Toggle between map and list views
  - Date-based sorting (Latest/Earliest)
  - Interactive event items
  - Smooth transitions
  - Automatic map centering on event click

### Changed
- Modified event marker click behavior
  - Replaced default Leaflet popup with custom floating window
  - Added smooth transition animations for the popup
  - Improved popup positioning to appear above footer
  - Added proper z-index layering to ensure footer is always clickable
  - Added pointer-events handling to prevent interaction with hidden popup
  - Temporarily removed event logos from popup (to be re-added in future development)
- Renamed "Resources" tab to "Ecosystem Hub"
- Updated navigation icons and styling
- Improved popup UI/UX:
  - Added smooth transitions
  - Improved mobile responsiveness
  - Enhanced accessibility
  - Better visual hierarchy

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
- Implemented responsive design for popups
- Added hover effects for navigation items
- Implemented localStorage for welcome popup state
- Enhanced popup interaction handling:
  - Click outside to close
  - Close button functionality
  - Smooth animations
  - Proper event delegation
- Added list view features:
  - View toggle functionality
  - Date parsing and sorting
  - Event list rendering
  - Map integration

### Files Modified
- index.html
  - Added PWA meta tags
  - Added manifest link
  - Added apple-touch-icon link
  - Updated popup HTML structure
  - Updated z-index values
  - Added Coming Soon popup
  - Added Telegram community link
  - Added Ecosystem Hub popup structure
  - Updated navigation bar
  - Added new popup components
  - Added Welcome popup
  - Added List View components
- scripts/main.js
  - Added service worker registration
  - Modified marker click handler
  - Added popup show/hide logic
  - Removed event logo display temporarily
  - Updated event handlers
  - Improved UI interactions
  - Added localStorage integration
  - Added welcome popup logic
  - Added list view and sorting
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
- Future Development:
  - Re-implement event logos in popup windows
  - Add proper logo handling and fallback system
  - Consider adding logo upload functionality for event organizers
- Develop Ecosystem Hub content:
  - Add dynamic content loading
  - Implement update system
  - Create grant application forms
  - Add event hosting guidelines
- Future improvements:
  - Add user preferences
  - Implement event filtering
  - Add search functionality
  - Enhance map interactions
  - Add event submission form
  - Implement user profiles
  - Add event bookmarking
  - Create event sharing functionality 