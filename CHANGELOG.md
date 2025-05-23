# Changelog

## [2024-06-09]

### Changed
- Overhauled event marker logic on the map:
  - Only ongoing and future events are shown.
  - Ongoing events are pulsating (CSS animation).
  - Past events are hidden (future: will be grayed out and unclickable if needed).
  - Improved marker color logic.
  - Fixed popup logic for all visible markers.
- UI/UX:
  - Map now fills available space, removed gray border.
  - Adjusted map bounds to valid OSM range, preventing tile 400 errors.
- Removed date sorting from the event list (UI and JS).
- Reverted service worker and Tailwind CSS loading to stable state.
- Cleaned up map initialization and tile layer options.
- Committed and pushed all changes to GitHub.

All notable changes to this project will be documented in this file.

## [2024-06-10]

### Changed
- Timeline bar logic in event popups and tooltips:
  - The bar now fills from the event's position to the right with the event color, and from the left to the event's position with a neutral color (#e5e7eb).
  - When the event is ongoing, the entire bar is filled with pink (Blossom Pink, #F7B3E9).
  - This provides a more intuitive countdown/progress visualization.
- Color scheme for event markers and timeline:
  - Distant events (30+ days): blue (#5094FF)
  - Events 7-30 days away: gradient between Blossom Pink (#F7B3E9) and blue
  - Events within 7 days and ongoing: Blossom Pink (#F7B3E9)
  - Ongoing events have a pulsating effect and all timeline/marker elements use Blossom Pink
- Event logo rendering:
  - All event logos in tooltips, popup cards, and list view cards now use the smaller @icons/icon-192x192.png as the default if no custom logo is provided.
  - Improved fallback logic for missing/broken logos.
- List view improvements:
  - Added a minimum width to the list view for better readability (initially 320px, then increased to 375px).

### Technical Details
- Updated renderTimeline function in scripts/main.js for new bar fill logic and color handling.
- Updated event logo rendering logic in scripts/main.js to use the optimized icon.
- Updated #list-view container in index.html to enforce a minimum width.

### UX/UI
- Timeline bar and event marker colors are now visually consistent and intuitive.
- List view is more readable and visually balanced on all screen sizes.
- Event logos are sharper and load faster due to optimized image usage.

## [2024-06-11]

### Added
- Map Legend popup:
  - Added a new help popup that explains the color coding of event markers
  - Shows examples of all marker states (30+ days, 7-30 days, within 7 days, ongoing)
  - Includes visual examples with the actual colors and animations
  - Accessible via a help button in the UI

### Changed
- Enhanced event marker tooltips:
  - Added event logo and name to tooltips on desktop view
  - Improved tooltip layout and spacing
  - Added "Click for more info" hint
  - Made tooltips more informative while keeping them clean
- Improved marker cluster appearance:
  - Clusters now use the color of the soonest event in the group
  - Added pulsating effect to clusters containing ongoing events
  - Improved cluster size and visibility
- List view enhancements:
  - Added vertical timeline bar with colored dots
  - Improved event card layout and spacing
  - Added proper date formatting and time display
  - Enhanced visual hierarchy of event information

### Technical Details
- Updated marker cluster configuration in scripts/main.js
- Added new help popup component to index.html
- Enhanced tooltip generation logic with new content structure
- Improved list view rendering with timeline integration

### UX/UI
- Map legend helps users understand the color coding system
- Tooltips are now more informative and visually appealing
- List view timeline provides better context for event timing
- Overall improved visual consistency across all components

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
  - Responsive design (30% width on desktop, full width on mobile)

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
- Enhanced list view layout:
  - Optimized for desktop viewing
  - Added shadow for depth
  - Improved visual separation from map

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