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
  - Supabase auth
  - Google OAuth
  - Wallet connection (Web3)
  - Guest mode (skip auth)
- **Backend:** Node.js + Express
- **Database:** MongoDB → Supabase

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
  - [ ] Search box (by keyword/title)

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

### Community Features (Phase 4)
- [ ] Community guidelines
- [ ] Event organizer resources
- [ ] Community feedback system
- [ ] Community announcements
- [ ] Local community pages
- [ ] See others attending same events
- [ ] Connect via DM, Telegram, or Discord

### Map Enhancements
- [ ] Custom map styles
- [ ] Clustering improvements
- [ ] Region-based filtering
- [ ] Distance calculations
- [ ] Route planning

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

1. Complete List View Features
   - Implement search functionality
   - Add filtering options
   - Enhance sorting capabilities

2. Complete Ecosystem Hub
   - Implement content management
   - Add grant information
   - Create event hosting guidelines

3. User Features (Phase 3)
   - Implement user profiles
   - Add journey functionality
   - Create sharing system

4. Community Features (Phase 4)
   - Add community guidelines
   - Create organizer resources
   - Implement feedback system

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
- `blockchain` (array)
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
- Community engagement
- Feature adoption
- User feedback

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
- Real-time chat (before Phase 4)
- Payments or ticketing
- Native mobile apps
- Desktop applications
- Browser extensions

## 💡 Development Tips

1. Start small and ship fast
2. Build one feature per phase
3. Avoid premature complexity
4. Focus on UI/UX polish
5. Test thoroughly on mobile
6. Keep codebase clean and documented 