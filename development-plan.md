# 🛠️ Journeys to DevConnect – Development Plan

## 🧱 Tech Stack Summary

- **Frontend:** Vanilla JavaScript, Tailwind CSS, HTML
- **Map:** Leaflet.js
- **Backend (Optional for Phase 1):** Supabase (Auth, DB)
- **Hosting:** Netlify (default; free, simple, and reliable for static PWAs)
- **Dev Environment:** Cursor.dev

## 🔄 Development Workflow (in Cursor)

1. Use `todo:` comments to generate UI and logic for each step
2. Start each feature with a minimal version
3. Use Supabase only when needed (start with static JSON)
4. Deploy regularly to test real-world usability using **Netlify**

## 🚫 Out of Scope (for now)
- User authentication (before Phase 3)
- Real-time chat (before Phase 4)
- Payments or ticketing

---

## 🧭 Goal of the App

Create a simple and fast progressive web app that shows curated Ethereum events around the world leading up to **DevConnect**, in Buenos Aires. Users can view these events on a map. Later stages will allow them to curate their own "journeys," create profiles, and connect with others.

---

## 💡 Phase 1 – "Event Discovery Map" (MVP)
### Core Features
- [x] Full-screen Leaflet.js map
- [x] Load static JSON with Ethereum event data
- [x] Place map pins for each event
- [x] On pin click: show event details (name, logo icon, date, location, link)
- [x] Tailwind CSS styling for responsiveness

### Map Restrictions
- [x] Disable map world wrapping and restrict panning to a single global map view
- [x] Restrict map zoom so user cannot zoom out of the map's intended scope
- [x] Map displays only English labeling

### Validation
- [x] Test and validate all features in this phase

---

## 🛠️ Phase 1.5 – Map & UI Improvements (Pre-Journey)

Before starting user journeys and profiles, implement the following:
- [ ] Add a togglable list view in the top right corner; clicking it slides in a list from the right
- [ ] List view shows all events (sorted by date), with a filter bar for event filtering
- [ ] Add a footer bar with two icons: one for map/list (event discovery), one for profiles (future use)
- [ ] Add a hamburger menu in the top right corner that expands to show:
    - [ ] Community (link to Telegram)
    - [ ] News/Resources (list grants, news, etc.)
- [ ] Update map to have a futuristic and minimalistic look (custom tile style, UI polish)
- [ ] Use small glowing orb markers for events (custom SVG/CSS)
- [ ] Implement marker clustering: markers merge/unmerge based on zoom, with a count indicator
- [ ] Highlight Argentina on the map with a neon or colored polygon outline (GeoJSON layer)
- [ ] Add the DevConnect logo as a special marker for Buenos Aires/Argentina

---

## 🆕 PWA Enhancement (after Phase 1.5, before Phase 2)
- [ ] Make it a PWA (manifest + service worker)

---

## 🆕 Optional Backend Enhancement (after PWA, before Phase 2)
- [ ] Use Supabase to fetch event data from a table

---

## ✈️ Phase 2 – "Create Your Journey"
### Core Features
- [ ] "Add to Journey" button on each event popup
- [ ] Save selected events in localStorage (no login)
- [ ] Create a "My Journey" view that displays selected events
- [ ] Generate a shareable URL (use query string or short ID)

### Optional Features
- [ ] Store journey data in Supabase
- [ ] Allow editing/removing events from journey
- [ ] Add event to calendar (e.g. Google Calendar)

### Validation
- [ ] Test and validate all features in this phase

---

## 🧑‍🚀 Phase 3 – "User Profiles & Login"

### 🎯 Objective:
Let users create accounts to save and sync their journeys across devices.

### 🧰 Features to Build in Cursor:
- [ ] Email or wallet-based sign-up/login (via Supabase)
- [ ] Profile page with photo, display name, social link
- [ ] Save journey in user account (not just localStorage)
- [ ] Public profile with shareable link (e.g. `/profile/username`)
- [ ] Calendar view in the user's profile

---

## 🌍 Phase 4 – "Social Layer"

### 🎯 Objective:
Enable users to connect with others on similar journeys.

### 🧰 Features to Build in Cursor:
- [ ] See who else is attending the same events
- [ ] Follow/Request to connect with others
- [ ] Optional: Add a chat or message feature for mutual attendees
- [ ] Notifications (event reminders, friend updates)

---

## ✅ Priority Notes

- Start small and ship fast: just a map + static events first
- Build one feature per phase, validate and test it
- Avoid premature complexity (auth, messaging, etc.)

---

## 🆕 General Enhancements & Future Considerations

- [ ] Ensure accessibility (a11y) for all features (keyboard navigation, screen reader support, color contrast)
- [ ] Implement robust error and loading state handling for all async actions (e.g., Supabase, PWA, etc.)
- [ ] Manual and (optional) automated testing for critical user flows
- [ ] (Optional) Add basic analytics/usage tracking (privacy-friendly, opt-in)
- [ ] (Optional) Admin/event submission and management features
- [ ] (Optional) Internationalization (i18n) for multi-language support
- [ ] Explicitly test and optimize for mobile/touch devices

---

