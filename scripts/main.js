// scripts/main.js

// Welcome Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user has seen the welcome popup before
    if (!localStorage.getItem('welcomeSeen')) {
        const welcomePopup = document.getElementById('welcome-popup');
        welcomePopup.classList.remove('hidden');

        // Close button functionality
        document.getElementById('close-welcome').addEventListener('click', function() {
            welcomePopup.classList.add('hidden');
            localStorage.setItem('welcomeSeen', 'true');
        });

        // Got it button functionality
        document.getElementById('got-it-button').addEventListener('click', function() {
            welcomePopup.classList.add('hidden');
            localStorage.setItem('welcomeSeen', 'true');
        });

        // Close when clicking outside
        welcomePopup.addEventListener('click', function(e) {
            if (e.target === welcomePopup) {
                welcomePopup.classList.add('hidden');
                localStorage.setItem('welcomeSeen', 'true');
            }
        });
    }
    
    // Hamburger menu functionality
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const menuDropdown = document.getElementById('menu-dropdown');
    
    hamburgerMenu.addEventListener('click', function() {
        menuDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburgerMenu.contains(e.target) && !menuDropdown.contains(e.target)) {
            menuDropdown.classList.add('hidden');
        }
    });
    
    // We removed the other dropdown menu buttons for simplicity
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Replace the Coming Soon Popup functionality with a toast
document.getElementById('profile-button').addEventListener('click', function() {
    showToast('Profiles coming soon!');
});

// Ecosystem Hub Popup functionality
document.getElementById('ecosystem-button').addEventListener('click', function() {
    const popup = document.getElementById('ecosystem-popup');
    popup.classList.remove('hidden');
});

document.getElementById('close-ecosystem').addEventListener('click', function() {
    const popup = document.getElementById('ecosystem-popup');
    popup.classList.add('hidden');
});

// Close ecosystem popup when clicking outside
document.getElementById('ecosystem-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

// Get UI elements
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

// Function to show/hide loading state
function setLoading(isLoading) {
    if (loadingElement) {
        loadingElement.classList.toggle('hidden', !isLoading);
    }
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

// Function to show error
function showError() {
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
    if (errorElement) {
        errorElement.classList.remove('hidden');
    }
}

// Set strict world bounds for OpenStreetMap
const southWest = L.latLng(-85.0511, -180);
const northEast = L.latLng(85.0511, 180);
const bounds = L.latLngBounds(southWest, northEast);

// Initialize the Leaflet map in the dedicated map container
const map = L.map('map', {
    center: [30, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0,
    worldCopyJump: true,
    attributionControl: false,
    zoomControl: false // Disable default zoom controls
});

// Add zoom level change handler to show/hide zoom-to-fit button
const zoomToFitButton = document.getElementById('zoom-to-fit');
map.on('zoomend', function() {
    // Show button when zoomed in significantly (zoom level > 4)
    if (map.getZoom() > 4) {
        zoomToFitButton.classList.remove('hidden');
    } else {
        zoomToFitButton.classList.add('hidden');
    }
});

// Add click handler for zoom-to-fit button
zoomToFitButton.addEventListener('click', function() {
    if (markerLayerGroup) {
        const bounds = markerLayerGroup.getBounds();
        map.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 8
        });
    }
});

// Add click handler to close popup when clicking on the map
map.on('click', function(e) {
    // Don't close if clicking on a marker
    if (e.originalEvent.target.tagName === 'path' || e.originalEvent.target.tagName === 'circle') {
        return;
    }
    const eventPopup = document.getElementById('event-popup');
    eventPopup.classList.add('translate-y-full');
    eventPopup.classList.add('opacity-0');
    eventPopup.classList.add('pointer-events-none');
});

// Add a basic tile layer (CartoDB Positron)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    noWrap: true
}).addTo(map);

// Add floating logo over Buenos Aires
const buenosAiresCoords = [-34.5798, -58.4209];
const devconnectDate = new Date('2025-11-12'); // DevConnect 2024 date
const now = new Date();
now.setHours(0, 0, 0, 0);
const daysToDevconnect = Math.round((devconnectDate - now) / (1000 * 60 * 60 * 24));
const logoColor = getEventColor(daysToDevconnect);

const logoIcon = L.divIcon({
    className: 'floating-logo',
    html: `<div class="relative"><img src="icons/devconnectlogo.png" class="w-12 h-12 animate-float relative z-10" style="filter: drop-shadow(0 0 5px ${logoColor}) drop-shadow(0 0 10px ${logoColor})" alt="DevConnect Logo"></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
});

const logoMarker = L.marker(buenosAiresCoords, {
    icon: logoIcon,
    interactive: true,
    zIndexOffset: 1000 // Ensure logo stays on top
}).addTo(map);

// Add hover effect to logo
logoMarker.on('mouseover', function() {
    const logoDiv = this.getElement().querySelector('.floating-logo');
    if (logoDiv) {
        const darkerColor = interpolateColor(logoColor, '#000000', 0.2); // Darken the current color
        logoDiv.querySelector('img').style.filter = `drop-shadow(0 0 5px ${darkerColor}) drop-shadow(0 0 10px ${darkerColor})`;
    }
});

logoMarker.on('mouseout', function() {
    const logoDiv = this.getElement().querySelector('.floating-logo');
    if (logoDiv) {
        logoDiv.querySelector('img').style.filter = `drop-shadow(0 0 5px ${logoColor}) drop-shadow(0 0 10px ${logoColor})`;
    }
});

// Add click handler to redirect to DevConnect website
logoMarker.on('click', function() {
    window.open('https://devconnect.org', '_blank');
});

// Add close button functionality for the event popup
document.getElementById('close-popup').addEventListener('click', function() {
    const popup = document.getElementById('event-popup');
    popup.classList.add('translate-y-full');
    popup.classList.add('opacity-0');
    popup.classList.add('pointer-events-none');
});

// List View functionality
let currentView = 'map'; // 'map' or 'list'
let originalEvents = []; // Store original events
let filteredEvents = []; // Store filtered events
const viewToggle = document.getElementById('view-toggle');
const viewIcon = document.getElementById('view-icon');
const viewText = document.getElementById('view-text');
const listView = document.getElementById('list-view');
const closeList = document.getElementById('close-list');
const eventsList = document.getElementById('events-list');
const searchInput = document.getElementById('search-input');

// --- Upcoming/Past Toggle Logic ---
let currentEventListType = 'upcoming'; // 'upcoming' or 'past'
const eventToggle = document.getElementById('event-toggle');
const [upcomingBtn, pastBtn] = eventToggle.querySelectorAll('button');

upcomingBtn.addEventListener('click', () => {
    if (currentEventListType !== 'upcoming') {
        currentEventListType = 'upcoming';
        updateEventToggleUI();
        renderEventList(originalEvents);
    }
});

pastBtn.addEventListener('click', () => {
    if (currentEventListType !== 'past') {
        currentEventListType = 'past';
        updateEventToggleUI();
        renderEventList(originalEvents);
    }
});

function updateEventToggleUI() {
    if (currentEventListType === 'upcoming') {
        upcomingBtn.classList.add('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        upcomingBtn.classList.remove('text-gray-500');
        upcomingBtn.disabled = true;
        pastBtn.classList.remove('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        pastBtn.classList.add('text-gray-500');
        pastBtn.disabled = false;
    } else {
        pastBtn.classList.add('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        pastBtn.classList.remove('text-gray-500');
        pastBtn.disabled = true;
        upcomingBtn.classList.remove('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        upcomingBtn.classList.add('text-gray-500');
        upcomingBtn.disabled = false;
    }
}

// Patch renderEventList to use the toggle state
const originalRenderEventList = renderEventList;
renderEventList = function(events) {
    let filtered;
    if (currentEventListType === 'upcoming') {
        filtered = events.filter(event => !isEventPast(event.date));
    } else {
        filtered = events.filter(event => isEventPast(event.date));
    }
    originalRenderEventList(filtered);
};

// Initialize toggle UI on load
updateEventToggleUI();

// Add variables for search state
let isSearchActive = false;
let currentSearchTerm = '';

// Function to update search indicator
function updateSearchIndicator() {
    const searchIndicator = document.getElementById('search-indicator');
    const searchCount = document.getElementById('search-count');
    
    if (isSearchActive && currentSearchTerm.trim()) {
        searchIndicator.classList.remove('hidden');
        // Update the count with the number of filtered events
        const filteredCount = filteredEvents.length;
        searchCount.textContent = filteredCount;
        
        // Add a subtle animation when the count changes
        searchCount.classList.add('animate-pulse');
        setTimeout(() => {
            searchCount.classList.remove('animate-pulse');
        }, 1000);
    } else {
        searchIndicator.classList.add('hidden');
    }
}

// Helper to render a horizontal timeline strip
function renderTimeline(eventDateStr, extraMargin = false, daysToEvent = null, isOngoing = false, tooltipMode = false) {
    const devconnectDate = new Date('2025-11-12'); // Update if needed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(eventDateStr);
    eventDate.setHours(0, 0, 0, 0);
    const total = devconnectDate - today;
    const progress = Math.max(0, Math.min(1, (eventDate - today) / total));
    const dotLeft = Math.round(progress * 100);
    
    // Get the appropriate color for this event
    const eventColor = getEventColor(daysToEvent);
    const neutralColor = '#e5e7eb'; // Tailwind gray-200
    
    // Bar style: left part is neutral, right part is event color
    let barStyle;
    if (isOngoing || daysToEvent === 0) {
        // Ongoing: fill entire bar with pink
        barStyle = `background: ${eventColor}; box-shadow: 0 0 8px ${eventColor}, 0 0 16px ${eventColor};`;
    } else {
        barStyle = `background: linear-gradient(90deg, ${neutralColor} 0%, ${neutralColor} ${dotLeft}%, ${eventColor} ${dotLeft}%, ${eventColor} 100%);`;
    }
    
    // Dot class: pulsing if ongoing
    const dotClass = isOngoing ? 'timeline-dot timeline-dot-ongoing' : 'timeline-dot';
    const dotStyle = isOngoing 
        ? `background: ${eventColor}; box-shadow: 0 0 8px ${eventColor}, 0 0 16px ${eventColor};`
        : `background: ${eventColor};`;
    
    // Label above the dot (only for popup card, not tooltip or list)
    let labelText = '';
    if (!extraMargin && !tooltipMode) {
        if (isOngoing || daysToEvent === 0) {
            labelText = 'Ongoing';
        } else if (daysToEvent === 1) {
            labelText = 'in 1 day';
        } else if (daysToEvent > 1) {
            labelText = `in ${daysToEvent} days`;
        }
    }
    
    // Tooltip mode: only endpoints, no label above dot
    if (tooltipMode) {
        return `
          <div class="timeline-strip${extraMargin ? ' timeline-strip-margin' : ''}">
            <div class="timeline-bar" style="${barStyle}"></div>
            <div class="${dotClass}" style="left: ${dotLeft}%; ${dotStyle}"></div>
            <div class="timeline-tooltip-labels">
              <span class="timeline-label-start">Today</span>
              <span class="timeline-label-end"><img src='icons/devconnectlogo.png' alt='DevConnect' class='timeline-logo' /></span>
            </div>
          </div>
        `;
    }
    
    // Default: no milestone labels, just endpoints and dot label (label only in popup)
    return `
      <div class="timeline-strip${extraMargin ? ' timeline-strip-margin' : ''}">
        <div class="timeline-bar" style="${barStyle}"></div>
        <div class="${dotClass}" style="left: ${dotLeft}%; ${dotStyle}"></div>
        <div class="timeline-labels">
          <span class="timeline-label-start">Today</span>
          <span class="timeline-label-end"><img src='icons/devconnectlogo.png' alt='DevConnect' class='timeline-logo' /></span>
        </div>
        ${labelText ? `<div class=\"timeline-dot-label\" style=\"left: ${dotLeft}%; color: ${eventColor}; font-weight: 600; top: -18px;\">${labelText}</div>` : ''}
      </div>
    `;
}

// Update marker tooltip to include timeline on desktop
function getTimeCountdown(daysToEvent, isOngoing, eventDateStr, event = null) {
    // Tooltip: use tooltipMode for simplified timeline
    const timeline = renderTimeline(eventDateStr, true, daysToEvent, isOngoing, true);
    let text = '';
    if (isOngoing || daysToEvent === 0) {
        text = '<span style="color:' + getEventColor(daysToEvent) + ';font-weight:600">Ongoing</span>';
    } else if (daysToEvent === 1) {
        text = '<span>Starts in: <span style="color:' + getEventColor(daysToEvent) + ';font-weight:600">1 day</span></span>';
    } else {
        text = '<span>Starts in: <span style="color:' + getEventColor(daysToEvent) + ';font-weight:600">' + daysToEvent + ' days</span></span>';
    }
    // Add logo and event name row
    let logoUrl = event && event.logo ? event.logo : 'icons/icon-192x192.png';
    let eventName = event && event.name ? event.name : '';
    let infoRow = event ? `<div class="tooltip-event-row"><img src="${logoUrl}" class="tooltip-event-logo" alt="logo"><span class="tooltip-event-name">${eventName}</span></div>` : '';
    // Only show timeline in tooltip if desktop
    if (window.innerWidth >= 768) {
        return `${timeline}<div style=\"margin-top:10px\">${text}</div>${infoRow}<div class=\"tooltip-moreinfo\">Click for more info</div>`;
    } else {
        return text;
    }
}

// Function to render event list
function renderEventList(events) {
    filteredEvents = events;

    // Group events by day (YYYY-MM-DD)
    const groups = {};
    filteredEvents.forEach(event => {
        const eventDate = new Date(event.date + 'T00:00:00');
        eventDate.setHours(0, 0, 0, 0);
        // Use local date string as key (YYYY-MM-DD)
        const key = eventDate.getFullYear() + '-' +
                    String(eventDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(eventDate.getDate()).padStart(2, '0');
        if (!groups[key]) groups[key] = [];
        groups[key].push(event);
    });

    // Helper to get label and weekday
    function getDayLabel(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(date + 'T00:00:00');
        eventDate.setHours(0, 0, 0, 0);
        const diff = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
        let label = '';
        if (diff === 0) label = 'Today';
        else if (diff === 1) label = 'Tomorrow';
        else if (diff > 1) label = `in ${diff} days`;
        else label = `${Math.abs(diff)} days ago`;
        const weekday = eventDate.toLocaleDateString(undefined, { weekday: 'long' });
        return { label, weekday, diff };
    }

    // Build HTML for the timeline and events
    let html = '<div id="floating-day-label" class="sticky top-0 z-20 inline-flex w-auto items-center bg-white/80 backdrop-blur rounded-full shadow text-lg font-bold mb-2" style="margin-left: 10px; margin-top: 12px; padding-left: 2px; padding-right: 8px; display: none;"></div>';
    html += '<div class="relative pt-2" style="min-height: 100px;">';
    const groupKeys = Object.keys(groups).sort();
    groupKeys.forEach((key, idx) => {
        const { label, weekday, diff } = getDayLabel(key);
        const firstEvent = groups[key][0];
        const eventDate = new Date(firstEvent.date + 'T00:00:00');
        eventDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysToEvent = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
        const dotColor = getEventColor(daysToEvent);
        const isOngoing = daysToEvent === 0;
        const dotClass = isOngoing ? 'pulsating-marker' : '';
        // Dot and label in a flex row, bar segment absolutely positioned below dot
        html += `
          <div class="flex flex-row items-start mb-2" data-day="${key}">
            <!-- Timeline column -->
            <div class="relative flex items-center justify-center" style="width: 2.5rem; min-width: 2.5rem; height: 2rem;">
              <div class="relative flex items-center justify-center" style="height: 1.5rem;">
                <div class="w-4 h-4 rounded-full ${dotClass}" style="background: ${dotColor};"></div>
                ${idx < groupKeys.length - 1 ? '<div class="absolute left-1/2 top-full -translate-x-1/2 border-l-2 border-dotted border-gray-300" style="height: 360px; mask-image: linear-gradient(to bottom, black 70%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);"></div>' : ''}
              </div>
            </div>
            <!-- Content column -->
            <div class="flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-1" style="height: 1.5rem;">
                <span class="font-bold text-base" style="position:relative;top:3px;">${label}</span>
                <span class="text-gray-400 text-base ml-1" style="position:relative;top:3px; font-weight: normal !important;">${weekday}</span>
              </div>
              ${groups[key].map(event => {
                const eventDate = new Date(event.date + 'T00:00:00');
                const options = { month: 'long', day: 'numeric' };
                const formattedDate = eventDate.toLocaleDateString(undefined, options);
                const tags = event.tags || ['Conference', 'Free', 'Volunteership'];
                const logoSrc = event.logo ? event.logo : 'icons/icon-192x192.png';
                return `
                  <div class="event-card p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors relative mt-0" 
                       data-lat="${event.location.lat}" 
                       data-lng="${event.location.lng}"
                       data-event-id="${event.id}">
                    <div class="flex flex-row items-center gap-4 mb-4">
                      <div class="flex-shrink-0">
                        <img src="${logoSrc}" 
                             alt="${event.name} logo" 
                             class="w-16 h-16 rounded-xl object-cover bg-gray-100"
                             onerror="this.src='icons/icon-192x192.png'">
                      </div>
                      <div class="flex flex-col">
                        <h3 class="font-bold text-xl mb-1">${event.name}</h3>
                        <div class="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>${formattedDate}${event.time ? ` at ${event.time}` : ''}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>${event.location.city}, ${event.location.country}</span>
                        </div>
                      </div>
                    </div>
                    <div class="mb-4">
                      <div class="flex flex-wrap gap-2">
                        ${tags.map(tag => `
                          <span class="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">${tag}</span>
                        `).join('')}
                      </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3 mt-2">
                      <a href="${event.link}" target="_blank" 
                         class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                      </a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
    });
    html += '</div>';
    eventsList.innerHTML = html;

    // Floating day label scroll logic
    const floatingLabel = document.getElementById('floating-day-label');
    const dayGroups = Array.from(eventsList.querySelectorAll('[data-day]'));
    function updateFloatingLabel() {
      if (eventsList.scrollTop <= 8) {
        floatingLabel.style.display = 'none';
        return;
      }
      const containerRect = eventsList.getBoundingClientRect();
      let current = null;
      for (const group of dayGroups) {
        const rect = group.getBoundingClientRect();
        if (rect.top - containerRect.top <= 8) {
          current = group;
        } else {
          break;
        }
      }
      if (current) {
        // Clone the exact day label row
        const labelRow = current.querySelector('.flex.items-center.gap-2.mb-1');
        if (labelRow) {
          // Get the day key and compute the color
          const dayKey = current.getAttribute('data-day');
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const eventDate = new Date(dayKey + 'T00:00:00');
          eventDate.setHours(0, 0, 0, 0);
          const daysToEvent = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
          const dotColor = getEventColor(daysToEvent);
          // Prepend the colored dot
          const dotHTML = `<div class='w-4 h-4 rounded-full mr-2.5' style='background:${dotColor}; display:inline-block;'></div>`;
          // Replace gap-2 with gap-4 for more space between words
          const labelRowClass = labelRow.className.replace('gap-2', 'gap-4');
          floatingLabel.innerHTML = `<div class='flex items-center'>${dotHTML}<span style='position:relative;top:-3px;display:flex;align-items:center;'>${labelRow.innerHTML}</span></div>`;
          floatingLabel.className = labelRowClass + ' sticky top-0 z-20 inline-flex w-auto bg-white/80 backdrop-blur rounded-full shadow text-lg font-bold mb-2 px-6 py-2';
          floatingLabel.style.display = '';
        }
      } else {
        floatingLabel.style.display = 'none';
      }
    }
    eventsList.addEventListener('scroll', updateFloatingLabel);
    // Initial update
    updateFloatingLabel();

    // Add click handlers to list items
    eventsList.querySelectorAll('.event-card').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on links or buttons
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            const eventId = this.dataset.eventId;
            
            // Find the corresponding event
            const event = filteredEvents.find(e => String(e.id) === eventId);
            
            if (event) {
                // Find the marker for this event
                let targetMarker = null;
                markerLayerGroup.eachLayer(marker => {
                    if (String(marker.options.eventId) === eventId) {
                        targetMarker = marker;
                    }
                });

                // Zoom to the marker with animation
                map.setView([lat, lng], 12, {
                    animate: true,
                    duration: 0.5
                });

                const eventDate = new Date(event.date + 'T00:00:00');
                const options = { month: 'long', day: 'numeric' };
                const formattedDate = eventDate.toLocaleDateString(undefined, options);
                
                // Calculate days to event
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const daysToEvent = Math.round((eventDate - now) / (1000 * 60 * 60 * 24));
                const isOngoing = isEventOngoing(event.date);
                
                const timeline = renderTimeline(event.date, false, daysToEvent, isOngoing);
                const tags = event.tags || ['Conference', 'Free', 'Volunteership'];
                
                // Update popup content
                const popupContent = document.getElementById('popup-content');
                popupContent.innerHTML = `
                    <!-- Timeline (top) -->
                    <div class="mb-4">
                        ${timeline}
                    </div>

                    <!-- Info Row: Logo left, Name/date right -->
                    <div class="flex flex-row items-center gap-4 mb-4">
                        <!-- Logo -->
                        <div class="flex-shrink-0">
                            <img src="${event.logo || 'icons/icon-192x192.png'}" 
                                 alt="${event.name} logo" 
                                 class="w-20 h-20 rounded-xl object-cover bg-gray-100"
                                 onerror="this.src='icons/icon-192x192.png'">
                        </div>
                        <!-- Name and Date/Time -->
                        <div class="flex flex-col">
                            <h3 class="font-bold text-2xl mb-1">${event.name}</h3>
                            <div class="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>${formattedDate}${event.time ? ` at ${event.time}` : ''}</span>
                            </div>
                            <div class="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>${event.location.city}, ${event.location.country}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Description & Tags (full width) -->
                    <div class="mb-4">
                        ${event.description ? `
                            <p class="text-gray-700 mb-3">${event.description}</p>
                        ` : ''}
                        <div class="flex flex-wrap gap-2">
                            ${tags.map(tag => `
                                <span class="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">${tag}</span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Actions (full width, bottom) -->
                    <div class="flex flex-col sm:flex-row gap-3 mt-2">
                        <a href="${event.link}" target="_blank" 
                           class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Visit Website
                        </a>
                    </div>
                `;
                
                // Show the popup by removing all classes that hide it
                const popup = document.getElementById('event-popup');
                popup.classList.remove('translate-y-full');
                popup.classList.remove('opacity-0');
                popup.classList.remove('pointer-events-none');
                popup.style.transform = 'translate(-50%, 0)';

                // Add click handler for location row
                const locationRow = popupContent.querySelector('.location-row');
                if (locationRow) {
                    locationRow.addEventListener('click', function() {
                        map.setView([event.location.lat, event.location.lng], 12);
                    });
                }
            }
        });
    });
}

// Helper function to get season from date
function getSeason(date) {
    const month = date.getMonth();
    // Northern Hemisphere seasons
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

// Add a variable to store the marker layer group
let markerLayerGroup;

// Function to add markers to the map
function addEventMarkers(events) {
    console.log('Adding markers for events:', events.length);

    // Create a marker cluster group
    markerLayerGroup = L.markerClusterGroup({
        // Customize cluster appearance
        iconCreateFunction: function(cluster) {
            const children = cluster.getAllChildMarkers();
            // Find the soonest event in the cluster
            let minDays = Infinity;
            let hasOngoing = false;
            children.forEach(marker => {
                if (marker.options.isOngoing) hasOngoing = true;
                if (marker.options.daysToEvent < minDays) minDays = marker.options.daysToEvent;
            });
            const clusterColor = hasOngoing
                ? '#F7B3E9'  // Use Blossom Pink for ongoing events
                : getEventColor(minDays);
            const pulsateClass = hasOngoing ? 'pulsating-marker' : '';
            return L.divIcon({
                html: `<div style="background:${clusterColor}" class="text-white rounded-full w-8 h-8 flex items-center justify-center font-bold ${pulsateClass}">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster',
                iconSize: L.point(32, 32)
            });
        }
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    events.forEach(event => {
        if (isEventPast(event.date)) {
            return;
        }
        const eventDate = new Date(event.date + 'T00:00:00');
        eventDate.setHours(0, 0, 0, 0);
        const daysToEvent = Math.round((eventDate - now) / (1000 * 60 * 60 * 24));
        const ongoing = isEventOngoing(event.date);
        const markerColor = ongoing ? '#F7B3E9' : getEventColor(daysToEvent);
        
        // Create marker with tooltip
        const marker = L.circleMarker([event.location.lat, event.location.lng], {
            radius: ongoing ? 12 : 8,
            fillColor: markerColor,
            color: ongoing ? '#F7B3E9' : markerColor,
            weight: ongoing ? 4 : 2,
            opacity: 1,
            fillOpacity: 0.85,
            isOngoing: ongoing,
            daysToEvent: daysToEvent,
            eventId: event.id
        });

        // Only bind tooltip on desktop (not mobile)
        if (window.innerWidth >= 768) {
            marker.bindTooltip(getTimeCountdown(daysToEvent, ongoing, event.date, event), {
                permanent: false,
                direction: 'top',
                className: 'custom-tooltip',
                offset: [0, -10]
            });
        }

        if (ongoing) {
            marker.on('add', function() {
                const svg = marker._path;
                if (svg) {
                    svg.classList.add('pulsating-marker');
                }
            });
        }
        marker.on('click', function() {
            const popupContent = document.getElementById('popup-content');
            const options = { month: 'long', day: 'numeric' };
            const formattedDate = eventDate.toLocaleDateString(undefined, options);
            const timeline = renderTimeline(event.date, false, daysToEvent, isEventOngoing(event.date));
            
            // Format event time if available
            const eventTime = event.time ? new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
            
            // Get social links if available
            const socialLinks = event.social_links || {};
            const tags = event.tags || ['Conference', 'Free', 'Volunteership', 'Community Hub'];
            
            popupContent.innerHTML = `
                <!-- Timeline (top) -->
                <div class="mb-4">
                    ${timeline}
                </div>

                <!-- Info Row: Logo left, Name/date right -->
                <div class="flex flex-row items-center gap-4 mb-4">
                    <!-- Logo -->
                    <div class="flex-shrink-0">
                        <img src="${event.logo || 'icons/icon-192x192.png'}" 
                             alt="${event.name} logo" 
                             class="w-20 h-20 rounded-xl object-cover bg-gray-100"
                             onerror="this.src='icons/icon-192x192.png'">
                    </div>
                    <!-- Name and Date/Time -->
                    <div class="flex flex-col">
                        <h3 class="font-bold text-2xl mb-1">${event.name}</h3>
                        <div class="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>${formattedDate}${event.time ? ` at ${event.time}` : ''}</span>
                        </div>
                        <div class="flex items-center gap-2 text-gray-700 text-sm font-medium mb-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>${event.location.city}, ${event.location.country}</span>
                        </div>
                    </div>
                </div>

                <!-- Description & Tags (full width) -->
                <div class="mb-4">
                    ${event.description ? `
                        <p class="text-gray-700 mb-3">${event.description}</p>
                    ` : ''}
                    <div class="flex flex-wrap gap-2">
                        ${tags.map(tag => `
                            <span class="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full">${tag}</span>
                        `).join('')}
                    </div>
                </div>

                <!-- Actions (full width, bottom) -->
                <div class="flex flex-col sm:flex-row gap-3 mt-2">
                    <a href="${event.link}" target="_blank" 
                       class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                    </a>
                </div>
            `;
            
            const popup = document.getElementById('event-popup');
            popup.classList.remove('translate-y-full');
            popup.classList.remove('opacity-0');
            popup.classList.remove('pointer-events-none');
            popup.style.transform = 'translate(-50%, 0)';
        });
        marker.on('mouseover', function() {
            this.setStyle({
                fillColor: ongoing ? '#F7B3E9' : markerColor,
                fillOpacity: 1
            });
        });
        marker.on('mouseout', function() {
            this.setStyle({
                fillColor: ongoing ? '#F7B3E9' : markerColor,
                fillOpacity: 0.85
            });
        });
        markerLayerGroup.addLayer(marker);
    });
    map.addLayer(markerLayerGroup);
}

// Function to update both list and map based on search
function updateSearchResults(searchTerm) {
    currentSearchTerm = searchTerm;
    isSearchActive = searchTerm.trim().length > 0;
    updateSearchIndicator();
    
    // Filter events based on search term
    const searchResults = originalEvents.filter(event => {
        if (!searchTerm.trim()) return true;
        
        // Convert date to month name and season for searching
        const eventDate = new Date(event.date + 'T00:00:00');
        const monthName = eventDate.toLocaleString('default', { month: 'long' });
        const season = getSeason(eventDate);
        
        const searchableText = [
            event.name,
            event.short_description,
            event.location.city,
            event.location.country,
            event.date,
            monthName,
            season,
            ...event.tags
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm.toLowerCase());
    });
    
    // Update list view
    renderEventList(searchResults);
    
    // Update map markers
    if (markerLayerGroup) {
        map.removeLayer(markerLayerGroup);
    }
    addEventMarkers(searchResults);
    
    // Fit map bounds to show all visible markers
    if (searchResults.length > 0) {
        const bounds = L.latLngBounds(searchResults.map(event => [event.location.lat, event.location.lng]));
        map.fitBounds(bounds);
    }
}

// Add clear search button functionality
const clearSearchButton = document.getElementById('clear-search');

// Update search input event listener
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value;
    // Show/hide clear button based on input
    clearSearchButton.classList.toggle('hidden', !searchTerm.trim());
    updateSearchResults(searchTerm);
});

// Add clear search button click handler
clearSearchButton.addEventListener('click', function() {
    searchInput.value = '';
    clearSearchButton.classList.add('hidden');
    updateSearchResults('');
    searchInput.focus();
});

// Toggle between map and list views
viewToggle.addEventListener('click', function() {
    if (currentView === 'map') {
        // Switch to list view
        listView.classList.remove('translate-x-full');
        viewToggle.classList.add('hidden');
        viewIcon.textContent = '🗺️';
        viewText.textContent = 'Map View';
        currentView = 'list';
    }
    // No else block: toggle cannot close the list view
});

// Close list view (X button)
closeList.addEventListener('click', function() {
    listView.classList.add('translate-x-full');
    viewToggle.classList.remove('hidden');
    viewIcon.textContent = '📋';
    viewText.textContent = 'List View';
    currentView = 'map';
    // Don't clear search state, just update indicator
    updateSearchIndicator();
});

// Modify the loadEvents function to store original events
async function loadEvents() {
    setLoading(true);
    try {
        const cacheBuster = `t=${Date.now()}&r=${Math.random()}`;
        console.log('Fetching events with cache buster:', cacheBuster);
        const response = await fetch(`data/events.json?${cacheBuster}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            console.error('Failed to load events:', response.status, response.statusText);
            throw new Error('Failed to load events');
        }
        
        const data = await response.json();
        console.log('Raw events data:', data);
        console.log('Loaded events:', data.events.length);
        
        // Store original events
        originalEvents = data.events;
        
        // Initial render of the list
        renderEventList(originalEvents);
        
        setLoading(false);
        return data.events;
    } catch (err) {
        console.error('Error loading events:', err);
        showError();
        return [];
    }
}

// Helper function to determine if an event is ongoing
function isEventOngoing(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    // Consider an event ongoing if it's today
    return event.toDateString() === now.toDateString();
}

// Helper function to determine if an event is in the future
function isEventFuture(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    return event > now;
}

// Helper function to determine if an event is in the past
function isEventPast(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);
    // Zero out the time for both dates
    now.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    return event < now;
}

// Helper function to interpolate color between two hex colors
function interpolateColor(color1, color2, factor) {
    const c1 = color1.match(/\w\w/g).map(x => parseInt(x, 16));
    const c2 = color2.match(/\w\w/g).map(x => parseInt(x, 16));
    const result = c1.map((v, i) => Math.round(v + factor * (c2[i] - v)));
    return `#${result.map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

// Helper to get marker color based on days until event
function getEventColor(daysToEvent) {
    // Color thresholds:
    // 30+ days = #5094FF (blue)
    // 7-30 days = Interpolate between Blossom Pink and #5094FF
    // 0-7 days = Blossom Pink (#F7B3E9)
    // Ongoing = Blossom Pink (#F7B3E9) with pulsating effect
    
    if (daysToEvent >= 30) {
        return '#5094FF'; // Blue for far away events
    } else if (daysToEvent > 7) {
        // Interpolate between Blossom Pink and blue for 7-30 days
        const factor = (daysToEvent - 7) / 23; // 23 is the range (30-7)
        return interpolateColor('#F7B3E9', '#5094FF', factor);
    } else {
        return '#F7B3E9'; // Blossom Pink for events within 7 days and ongoing
    }
}

// Load and display events
loadEvents().then(events => {
    if (events.length > 0) {
        addEventMarkers(events);
        // Fit map bounds to show all markers
        const bounds = L.latLngBounds(events.map(event => [event.location.lat, event.location.lng]));
        map.fitBounds(bounds);
    } else {
        console.error('No events loaded');
    }
});

// Help Popup functionality
const helpButton = document.getElementById('help-button');
const helpPopup = document.getElementById('help-popup');
const closeHelp = document.getElementById('close-help');

let isHelpPopupOpen = false;

function showHelpPopup() {
    helpPopup.classList.remove('opacity-0');
    helpPopup.classList.remove('pointer-events-none');
    helpPopup.classList.remove('translate-y-2');
    isHelpPopupOpen = true;
}

function hideHelpPopup() {
    helpPopup.classList.add('opacity-0');
    helpPopup.classList.add('pointer-events-none');
    helpPopup.classList.add('translate-y-2');
    isHelpPopupOpen = false;
}

helpButton.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isHelpPopupOpen) {
        hideHelpPopup();
    } else {
        showHelpPopup();
    }
});

closeHelp.addEventListener('click', function(e) {
    e.stopPropagation();
    hideHelpPopup();
});

// Close help popup when clicking outside
document.addEventListener('click', function(e) {
    if (isHelpPopupOpen && !helpPopup.contains(e.target) && e.target !== helpButton) {
        hideHelpPopup();
    }
});

// Add search indicator click handler
document.getElementById('search-indicator').addEventListener('click', function() {
    // Show list view
    listView.classList.remove('translate-x-full');
    viewToggle.classList.add('hidden');
    viewIcon.textContent = '🗺️';
    viewText.textContent = 'Map View';
    currentView = 'list';
    
    // Focus search input
    searchInput.focus();
    // Restore previous search term
    searchInput.value = currentSearchTerm;
});

// Add this function after the existing popup functionality (around line 80)
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = message;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, -50%)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -60%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
} 