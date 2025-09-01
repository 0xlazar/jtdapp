# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Journey to DevConnect is a Progressive Web App (PWA) that helps users discover and track blockchain events around the world. It's a static web application built with vanilla JavaScript, HTML5, and Tailwind CSS, featuring an interactive world map powered by Leaflet.js.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Map Library**: Leaflet.js with MarkerCluster plugin
- **Backend**: Supabase (for event submissions)
- **PWA**: Service worker (`sw.js`) with offline capabilities
- **Hosting**: GitHub Pages (with custom domain journeytodevconnect.com)
- **Analytics**: Simple Analytics (privacy-first)

## Development Commands

Since this is a static web application with no build process, development is straightforward:

### Local Development Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve
```

Access at:
- `http://localhost:8000` (Python)
- `http://localhost:3000` (Node.js)

### Deployment
The app auto-deploys to GitHub Pages on push to main branch. No build step required.

## Architecture Overview

### Core Application Structure
```
jtdapp/
├── data/
│   └── events.json          # Static event data (will migrate to Supabase)
├── scripts/
│   ├── main.js             # Core application logic & UI interactions
│   ├── supabase-config.js  # Supabase configuration
│   ├── supabase-events.js  # Event data fetching logic
│   └── submit-event.js     # Event submission form logic
├── submit-event/           # Event submission page
├── admin/                  # Admin interface (future)
├── icons/                  # PWA icons and assets
├── index.html              # Main application
├── manifest.json           # PWA manifest
└── sw.js                  # Service worker
```

### Data Architecture

**Current State**: Events are stored in `data/events.json` with this structure:
```json
{
  "id": 1,
  "name": "Event Name",
  "date": "2025-05-19",
  "location": {
    "lat": -1.286389,
    "lng": 36.817223,
    "city": "Nairobi",
    "country": "Kenya"
  },
  "link": "https://example.com",
  "logo": null,
  "short_description": "Description",
  "tags": ["Conference", "Free", "Community Hub"]
}
```

**Migration in Progress**: Moving to Supabase database with expanded schema for event submissions.

### Key Features & Components

1. **Interactive Map** (`scripts/main.js`)
   - Leaflet.js integration with custom markers
   - Event clustering for better visualization  
   - Color-coded markers based on event timing
   - Custom tooltips with timeline strips

2. **List View** 
   - Upcoming/Past event toggle
   - Search functionality (by name, location, month, tags)
   - Vertical timeline with event cards

3. **Event Submission** (`submit-event/`)
   - Form for community event submissions
   - Supabase backend integration
   - Pending/approved workflow

4. **PWA Features**
   - Offline support via service worker
   - Mobile-responsive design
   - Installable on devices

## Supabase Integration

### Configuration
- URL: Configured in `scripts/supabase-config.js`
- Database: `events` table with comprehensive schema
- Authentication: Anonymous submissions allowed
- RLS: Row Level Security policies configured

### Database Schema
The Supabase `events` table includes fields for:
- Basic event info (name, description, dates, location)
- Event type and URLs
- Special tags (free, Ethereum 10th anniversary, Destino grant, etc.)
- Contact information
- Submission status and timestamps

## Development Notes

### Event Status System
- **Ongoing**: Events happening now (pulsating pink markers)
- **Soon**: Events within 7 days (pink markers)
- **Medium**: Events 7-30 days away (gradient markers)
- **Future**: Events 30+ days away (blue markers)

### Search Implementation
The search system supports:
- Event names and descriptions
- City and country names
- Month names and seasons
- Event tags
- Keywords

### Mobile Responsiveness
- Mobile-first design approach
- Responsive list view (30% width on desktop)
- Touch-friendly interactions
- Optimized timeline components

## Important Files to Understand

1. **`scripts/main.js`**: Core application logic, map initialization, UI interactions
2. **`data/events.json`**: Current event data source (being migrated)
3. **`scripts/supabase-events.js`**: Data fetching and Supabase integration
4. **`index.html`**: Main application with embedded styles and layout
5. **`DEV_PLAN.md`**: Detailed development roadmap and feature status

## Common Tasks

### Adding New Events
Currently events are added via:
1. Direct editing of `data/events.json` (temporary)
2. Event submission form at `/submit-event` (future primary method)

### Styling Conventions
- Tailwind CSS utility classes
- Custom CSS in `<style>` blocks in `index.html`
- Gradient themes: `linear-gradient(90deg, #5094FF 0%, #F7B3E9 100%)`
- Color scheme: Blue (#5094FF) to Pink (#F7B3E9)

### Testing Changes
Since there's no build process, simply:
1. Make changes to source files
2. Refresh browser to see updates
3. Test PWA features in incognito/private mode
4. Verify mobile responsiveness using browser dev tools

## Deployment Notes

- Auto-deploys to GitHub Pages on main branch push
- Custom domain: journeytodevconnect.com
- HTTPS enforced
- CDN-based asset delivery (Tailwind, Leaflet)
- Service worker handles caching and offline functionality