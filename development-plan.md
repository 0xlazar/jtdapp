# 🛠️ Journeys to DevConnect – Development Plan

## 🧱 Tech Stack Summary

- **Frontend:** HTML + Tailwind CSS
- **Map:** Leaflet.js
- **Data:** JSON (→ Supabase later)
- **Search/Filter:** Vanilla JS filtering
- **Auth (later):** Supabase auth
- **Hosting:** Netlify
- **Dev Environment:** Cursor.dev

## 🔄 Development Workflow

1. Use `// todo:` comments in Cursor to generate components and logic
2. Start small (map + markers), build confidence, then expand
3. Use ChatGPT or Cursor for help with UI, filters, and event loading logic
4. Prioritize UI and UX polish (hover states, mobile view, etc.)

## 🚫 Out of Scope (for now)
- User authentication (before Phase 3)
- Real-time chat (before Phase 4)
- Payments or ticketing

---

## 🧭 App Structure (UI Layout)

```
+--------------------------------------------------+
| Journey to DevConnect                            | ← App Title (top center)
+--------------------------------------------------+
|                                                  |
|  🗺️ Map View or 📄 List View (Toggle - top right)  |
|                                                  |
|  📍 Map with event markers                        |
|                                                  |
|  🗂️ List view with filters and search (optional)  |
|                                                  |
+--------------------------------------------------+
| 🗺️ Map | 👥 Community | 📚 Resources | 👤 Profile     | ← Bottom Nav Bar
+--------------------------------------------------+
```

---

## ✅ Phase 1 – Foundation & Map View MVP

### 🎯 Goal
A fully working map-based view with clickable markers and event info.

### 🔧 What to Build
- [x] Map view using Leaflet.js
- [x] Static event data from JSON file
- [x] Markers on map for each event
- [x] Click marker → show floating window with:
  - [x] Name
  - [x] Dates
  - [x] Tags
  - [x] City + Country
  - [x] Website URL
- [x] App title at top: Journey to DevConnect
- [x] Footer navbar (non-functional for now):
  - [x] Map 🗺️ (active)
  - [x] Community 👥 (greyed out)
  - [x] Resources 📚 (greyed out)
  - [x] Profile 👤 (greyed out)

---

## 🔁 Phase 2 – List View + Filters + Search

### 🎯 Goal
Enable users to explore the same events in a searchable, filterable list view.

### 🔧 What to Build
- [ ] Toggle button to switch between Map ↔ List
- [ ] List view of events, sorted by date
- [ ] Top filter/search bar with:
  - [ ] Month selector (e.g. May, June, July)
  - [ ] Region filter (e.g. Europe, Asia)
  - [ ] Cost (free/paid)
  - [ ] Volunteership opportunities
  - [ ] Search box (by keyword/title)

---

## 👥 Phase 3 – User Profiles & Journeys (Optional)

Build this once you're comfortable with frontend and want to dive into auth, state, and databases.

### 🔧 Features
- [ ] "Add to Journey" button on event cards
- [ ] Save selected events to localStorage
- [ ] Profile page with journey list
- [ ] Shareable journey view (/j/username123)
- [ ] Supabase login with email or wallet

---

## 🤝 Phase 4 – Community & Social Layer

Only tackle this once basic discovery + profile features are done.

### 🔧 Features
- [ ] See others attending the same events
- [ ] View shared journeys
- [ ] Connect via DM, Telegram links, or Discord usernames

---

## 💡 Development Tips

1. Start small and ship fast: just a map + static events first
2. Build one feature per phase, validate and test it
3. Avoid premature complexity (auth, messaging, etc.)
4. Focus on UI/UX polish from the start
5. Test thoroughly on mobile devices
6. Keep the codebase clean and well-documented

---

## 🆕 General Enhancements & Future Considerations

- [ ] Ensure accessibility (a11y) for all features
- [ ] Implement robust error and loading state handling
- [ ] Manual and automated testing for critical user flows
- [ ] Add basic analytics/usage tracking (privacy-friendly, opt-in)
- [ ] Admin/event submission and management features
- [ ] Internationalization (i18n) for multi-language support
- [ ] Explicitly test and optimize for mobile/touch devices

---

## 📦 Event Data Schema & Extensibility

### Minimal Event Fields (MVP)
- `name` (string)
- `date` (string, ISO format recommended)
- `location` (object)
  - `city` (string)
  - `country` (string)
- `link` (string)
- `logo` (URL string)

### Planned/Optional Future Fields
- `cost` (string: "free", "paid", or both)
- `volunteership` (boolean or string: true/false or "yes"/"no")
- `region` (string: e.g., "Europe", "Asia")
- `blockchain` (array of strings: ["Ethereum", "Polygon", ...])
- `tags` (array of strings: ["conference", "hackathon", ...])
- `description` (string)
- `socials` (object: e.g., `{ "twitter": "...", "telegram": "...", "discord": "..." }`)

### Approach
- Start with the minimal schema for MVP.
- Add new fields as needed; old events can omit them.
- Code should handle missing fields gracefully.
- When moving to a database (e.g., Supabase), add new columns as needed (nullable).
- For multi-value fields, use arrays.

### Example (future-ready event object)
```json
{
  "id": 1,
  "name": "EthCC",
  "date": "2024-07-08",
  "location": {
    "city": "Paris",
    "country": "France",
    "lat": 48.8566,
    "lng": 2.3522
  },
  "link": "https://ethcc.io/",
  "logo": "https://ethcc.io/assets/img/logo.svg",
  "cost": "paid",
  "volunteership": false,
  "region": "Europe",
  "blockchain": ["Ethereum"],
  "tags": ["conference"],
  "description": "The largest annual Ethereum conference in Europe.",
  "socials": {
    "twitter": "https://twitter.com/ethcc",
    "telegram": "https://t.me/ethcc"
  }
}
```
---

