# 🛠️ Journey to DevConnect – Development Plan

## 🧱 Tech Stack

### Current Stack
- **Frontend:** HTML5 + Tailwind CSS
- **Map:** Leaflet.js
- **Data:** JSON (→ Supabase later)
- **Search/Filter:** Vanilla JS filtering
- **Hosting:** Github Pages
- **Dev Environment:** Cursor.dev
- **Domain:** Custom domain (e.g., journeytodevconnect.com)

### Planned Stack
- **Auth:** 
  - Supabase auth (for non Web3)
  - Wallet connection (for Web3)
  - Guest mode (skip auth)
- **Hosting:** Netlify
- **Backend:** Node.js + Express
- **Database:** Supabase
- **Analytics:** Simple Analytics (privacy-friendly)

## ✅ Done:

### Core Functionality
- [x] Interactive map with event markers
- [x] Event details popup
- [x] PWA support with offline capabilities
- [x] Welcome popup for first-time visitors
- [x] List view with date-based sorting
- [x] Ecosystem Hub (Coming Soon)

- [x] Purchased and configured journeytodevconnect.com as a custom domain in Github Pages

### UI/UX Improvements
- [x] Responsive design for all screen sizes
- [x] Smooth transitions and animations
- [x] Mobile-first approach

### Technical Implementation
- [x] Service worker for offline support
- [x] LocalStorage for user preferences
- [x] Event data management
- [x] Map integration with Leaflet
- [x] Date parsing and sorting

- [x] Toggle between Map ↔ List views
- [x] List view of events, sorted by date
- [x] Desktop-optimized layout (30% width)
- [x] Redesign list event cards to match map
- [x] Search bar
   - [x] by keyword
   - [x] by name
   - [x] by location (city, country)
   - [x] by month
   - [x] by season (winter, summer, etc.)
   - [x] by tag
- [x] Search filter indicator
- [x] Enforce HTTPS in Github Pages once it's done with the TSL certificate
- [x] https://search.google.com/search-console/welcome
- [x] Set up email addresses - https://mail.zoho.com/zm/

- [x] Added a tooltip when hovering over markers "Starts in X days"
- [x] Changed the colors of the event markers to be more visually clear (from warm to green)
- [x] Added a timeline strip on event marker hover, pop up card and list event card
  - [x] Event marker tooltip now includes: timeline strip, starts in x days counter, logo, and event name
- [x] When hover over DevCon floating marker, it should also have a timeline strip and "Starts in x days"

- [ ] Redesign the List View:
  - [x] Upcoming/Past Toggle Placement
      Move the Upcoming/Past toggle to the top left, just left of the close (X) button.
  - [x] Vertical Timeline Bar
      Add a vertical timeline bar on the left.
      Use logic to display "Today", "Tomorrow", or "in X days", followed by the day name (e.g., "Wednesday").
      Also make the dot on the timeline be colored (or glowing) according to our event marker color logic
  - [ ] Floating "In X Days" pill
    - [ ] Aligned it to the timeline dot and text, right now it's not
  - [ ] Dedicated Event Card Div
      Each event should be inside a visually distinct card, similar to Luma's design.
  - [ ] Event Card Sections
      Section 1: Logo, name, location, and date (logo on the left, other info on the right).
      Section 2: Description and tags.
      Section 3: Action buttons, with "Add to Journey" as the primary button.

## 🎯 Next Steps (Priority Order)

- [ ] Fill out the current events with logos, info and tags
- [ ] 

### Create an Event page
Data from user:
- [ ] Name of Event
- [ ] Description (please be mindful of this, for keyword filtering and SEO purposes)
- [ ] Start Date
- [ ] End Date
- [ ] Location (City, Country)
- [ ] Logo (what size??)
- [ ] Website URL
- [ ] Is this a conference of gathering (1day event)?
- [ ] Is it part of a conference week
- [ ] (unlocks) Conference week URL
- [ ] Is there a hackathon?
- [ ] (unlocks) Hackathon URL
- [ ] Is this a free event?
- [ ] Do you have open volunteerships?
- [ ] Do you have open scholarships?
- [ ] Is this a Destino Grant gathering?
- [ ] Is this a 10 Years of Ethereum gathering?


## 📋 Afterwards Planned Features

- [ ] Create journey sharing system

- [ ] Sliding bar to navigate from past to future

### Authentication
- [ ] Welcome screen with auth options:
  - [ ] Sign in with Google
  - [ ] Connect Wallet
  - [ ] Skip (continue as guest)
- [ ] Persistent session management
- [ ] Guest mode limitations
- [ ] Auth state persistence
- [ ] Seamless auth flow

### User Features
- [ ] User profiles
- [ ] "Add to Journey" functionality
- [ ] Event bookmarking
- [ ] Shareable journey view (/j/username123)
- [ ] Personal calendar integration
- [ ] Event notifications
- [ ] Supabase login with email or wallet

### Map Enhancements
- [ ] Route planning (Add To Journey)

### Event Management
- [x] Event submission form
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




   Complete Ecosystem Hub
   - Implement content management
   - Add grant information

5. User Features (Phase 3)
   - Implement user profiles
   - Add journey functionality
   



Bugs to fix for later:
- Horizontal timeline bar on mobile view too wide
- List view day label pill clean up
