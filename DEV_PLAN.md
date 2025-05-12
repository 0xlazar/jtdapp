# 🛠️ Journey to DevConnect – Development Plan

## 🧱 Tech Stack

### Current Stack
- **Frontend:** HTML5 + Tailwind CSS
- **Map:** Leaflet.js
- **Data:** JSON (→ Supabase later)
- **Search/Filter:** Vanilla JS filtering
- **Hosting:** Github Pages
- **Dev Environment:** Cursor.dev

### Planned Stack
- **Auth:** 
  - Supabase auth (for non Web3)
  - Wallet connection (for Web3)
  - Guest mode (skip auth)
- **Hosting:** Netlify
- **Backend:** Node.js + Express
- **Database:** Supabase
- **Analytics:** Simple Analytics (privacy-friendly)
- **Domain:** Custom domain (e.g., journeytodevconnect.com)

## ✅ Completed Features

### Core Functionality
- Interactive map with event markers
- Event details popup
- PWA support with offline capabilities
- Welcome popup for first-time visitors
- List view with date-based sorting
- Ecosystem Hub (Coming Soon)

### Infrastructure
- Purchased and configured journeytodevconnect.com as a custom domain in Github Pages

### UI/UX Improvements
- Responsive design for all screen sizes
- Smooth transitions and animations
- Mobile-first approach
- Desktop-optimized list view (30% width)
- Community-focused messaging

### Technical Implementation
- Service worker for offline support
- LocalStorage for user preferences
- Event data management
- Map integration with Leaflet
- Date parsing and sorting

## 🚧 Current Phase – List View & Filters

### 🎯 Goal
Enable users to explore events in a searchable, filterable list view.

### 🔧 In Progress
- [x] Toggle between Map ↔ List views
- [x] List view of events, sorted by date
- [x] Desktop-optimized layout (30% width)
- [ ] Redesign list event cards to match map
- [ ] Search bar (keyword search)
- [ ] Filters bar with:
  - [ ] Select month
  - [ ] Select region
  - [ ] Cost filter (free/paid)
  - [ ] Volunteership opportunities
  - [ ] Search box (by keyword)
- [ ] Add tags to list event
- [x] Enforce HTTPS in Github Pages once it's done with the TSL certificate
- [ ] https://search.google.com/search-console/welcome


## 📋 Planned Features

### Authentication (Phase 2.5)
- [ ] Welcome screen with auth options:
  - [ ] Sign in with Google
  - [ ] Connect Wallet
  - [ ] Skip (continue as guest)
- [ ] Persistent session management
- [ ] Guest mode limitations
- [ ] Auth state persistence
- [ ] Seamless auth flow

### User Features (Phase 3)
- [ ] User profiles
- [ ] "Add to Journey" functionality
- [ ] Event bookmarking
- [ ] Shareable journey view (/j/username123)
- [ ] Personal calendar integration
- [ ] Event notifications
- [ ] Supabase login with email or wallet

### Map Enhancements
- [ ] Map UI - minimalistic and neutral
- [ ] Filtering
- [ ] Route planning (Add To Journey)
- [ ] Map cluster styling
- [ ] Custom color coding by region or date (e.g., warmer colors for events closer to today)

### Event Management
- [ ] Event submission form
- [ ] Event verification system
- [ ] Event updates and changes
- [ ] Event analytics
- [ ] Event feedback system

### Community Features
- [ ] Linked to the Events somehow
- [ ] Ethereum Communities Directory (from https://ethereum.org/en/community/events/)
  - [ ] List of all Ethereum communities from ethereum.org
  - [ ] Community profiles with:
    - [ ] Location
    - [ ] Social media links
    - [ ] Meeting frequency
    - [ ] Community size
    - [ ] Focus areas
  - [ ] Search and filter communities
  - [ ] Map integration for community locations
  - [ ] Community event calendar integration
  - [ ] Community contact information

### Technical Improvements
- [ ] Performance optimization
- [ ] Advanced caching
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Accessibility improvements

## 🎯 Next Steps (Priority Order)

1. Infrastructure Setup
   - [x] Purchase and configure journeytodevconnect.com as a custom domain in Github Pages
   - Set up Simple Analytics
   - [x] Configure DNS and SSL
   - Set up email addresses

2. Map improvements:
   - Change the date format on the map and list views to "June 4-7" or just "June 4" if it's one day
   - On desktop, make it smaller so it doesn't take up the entire width
   - Redesign the information of the card to the one Yann sent

3. Complete List View Features
   - Implement search functionality
   - Add filtering options
   - Enhance sorting capabilities

4. Complete Ecosystem Hub
   - Implement content management
   - Add grant information
   - Create event hosting guidelines

5. User Features (Phase 3)
   - Implement user profiles
   - Add journey functionality
   - Create sharing system

## 📦 Event Data Schema

### Current Fields for Event
- `name` (string)
- `date` (string)
- `location` (object)
  - `city` (string)
  - `country` (string)
  - `lat` (number)
  - `lng` (number)
- `link` (string)
- `short description` (string)

### Planned Fields for Event
- `event_type` (string: "conference" or "gathering")
- `region` (string)
- `blockchain_week` (boolean)
- `has_hackathon` (boolean)
- `cost` (string: "free", "paid")
- `free_entry` (boolean)
- `volunteership` (boolean)
- `blockchain ecosystem` (array)
- `tags` (array)
- `socials` (object)