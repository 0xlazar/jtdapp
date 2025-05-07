# 🛠️ Journey to DevConnect – Development Plan

## 🧱 Tech Stack

### Current Stack
- **Frontend:** HTML5 + Tailwind CSS
- **Map:** Leaflet.js
- **Data:** JSON (→ Supabase later)
- **Search/Filter:** Vanilla JS filtering
- **Hosting:** Netlify
- **Dev Environment:** Cursor.dev

### Planned Stack
- **Auth:** 
  - Supabase auth (for non Web3)
  - Wallet connection (for Web3)
  - Guest mode (skip auth)
- **Backend:** Node.js + Express
- **Database:** MongoDB → Supabase
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
- [ ] Top filter/search bar with:
  - [ ] Month selector
  - [ ] Region filter
  - [ ] Cost filter (free/paid)
  - [ ] Volunteership opportunities
  - [ ] Search box (by keyword)

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

### Technical Improvements
- [ ] Performance optimization
- [ ] Advanced caching
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Accessibility improvements

## 🎯 Next Steps (Priority Order)

1. Infrastructure Setup
   - Purchase and configure custom domain
   - Set up Simple Analytics
   - Configure DNS and SSL
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

### Current Fields
- `name` (string)
- `date` (string)
- `location` (object)
  - `city` (string)
  - `country` (string)
  - `lat` (number)
  - `lng` (number)
- `link` (string)

### Planned Fields
- `cost` (string: "free", "paid")
- `volunteership` (boolean)
- `region` (string)
- `blockchain ecosystem` (array)
- `tags` (array)
- `description` (string)
- `socials` (object)

## 📊 Performance Metrics

### Current Focus
- Page load time
- Map performance
- List view responsiveness
- Offline functionality
- User engagement

### Future Metrics
- User retention
- Event submission rate
- Feature adoption
- User feedback
- Analytics tracking:
  - Page views and unique visitors
  - User journey tracking
  - Event interaction metrics
  - Feature usage statistics
  - Geographic distribution

## 🔄 Development Workflow

### Code Management
- Feature branches
- Pull request reviews
- Automated testing
- Continuous integration
- Regular deployments

### Documentation
- Code documentation
- User guides
- API documentation
- Changelog maintenance
- Development guides

## 🚫 Out of Scope (for now)
- User authentication (before Phase 3)
- Browser extensions

## 💡 Development Tips

1. Start small and ship fast
2. Build one feature per phase
3. Avoid premature complexity
4. Focus on UI/UX polish
5. Test thoroughly on mobile
6. Keep codebase clean and documented 