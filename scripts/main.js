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

// Coming Soon Popup functionality
document.getElementById('profile-button').addEventListener('click', function() {
    const popup = document.getElementById('coming-soon-popup');
    popup.classList.remove('hidden');
});

document.getElementById('close-coming-soon').addEventListener('click', function() {
    const popup = document.getElementById('coming-soon-popup');
    popup.classList.add('hidden');
});

// Close popup when clicking outside
document.getElementById('coming-soon-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
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
    attributionControl: false
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
let sortOrder = 'asc'; // 'asc' or 'desc'
let originalEvents = []; // Store original events
let filteredEvents = []; // Store filtered events
const viewToggle = document.getElementById('view-toggle');
const viewIcon = document.getElementById('view-icon');
const viewText = document.getElementById('view-text');
const listView = document.getElementById('list-view');
const closeList = document.getElementById('close-list');
const eventsList = document.getElementById('events-list');
const sortToggle = document.getElementById('sort-toggle');
const searchInput = document.getElementById('search-input');

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

// Function to render event list
function renderEventList(events) {
    // Filter out past events and sort remaining events by date
    filteredEvents = events
        .filter(event => !isEventPast(event.date))
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    
    eventsList.innerHTML = filteredEvents.map(event => {
        // Format date as 'Month Day'
        const eventDate = new Date(event.date);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = eventDate.toLocaleDateString(undefined, options);
        
        // Get tags from event or use default tags
        const tags = event.tags || ['Conference', 'Free', 'Volunteership'];
        
        return `
            <div class="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors relative" 
                 data-lat="${event.location.lat}" 
                 data-lng="${event.location.lng}">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xl font-bold">Logo</div>
                    <div>
                        <h3 class="font-bold text-lg">${event.name}</h3>
                        <p class="text-gray-600 text-sm">${event.short_description || ''}</p>
                    </div>
                </div>
                <div>
                    <p class="text-blue-700 text-sm font-semibold mb-2">${formattedDate} &bull; ${event.location.city}, ${event.location.country}</p>
                    <div class="flex flex-wrap gap-2 mb-2">
                        ${tags.map(tag => `
                            <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">${tag}</span>
                        `).join('')}
                    </div>
                    <a href="${event.link}" target="_blank" class="text-blue-500 hover:underline text-sm block mb-2">Visit Website</a>
                    <button class="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">Add To Journey</button>
                </div>
            </div>
        `;
    }).join('');

    // Add click handlers to list items
    eventsList.querySelectorAll('div').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on links or buttons
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            map.setView([lat, lng], 12);
            
            // Find the corresponding event
            const event = filteredEvents.find(e => 
                e.location.lat === lat && e.location.lng === lng
            );
            
            if (event) {
                const eventDate = new Date(event.date);
                const options = { month: 'long', day: 'numeric' };
                const formattedDate = eventDate.toLocaleDateString(undefined, options);
                const tags = event.tags || ['Conference', 'Free', 'Volunteership', 'Community Hub'];
                
                // Update popup content
                const popupContent = document.getElementById('popup-content');
                popupContent.innerHTML = `
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-2xl font-bold">Logo</div>
                        <div>
                            <h3 class="font-bold text-xl mb-1">${event.name}</h3>
                            <p class="text-gray-600 text-sm mb-1">${event.short_description || ''}</p>
                            <p class="text-blue-700 text-base font-semibold mb-2">${formattedDate} &bull; ${event.location.city}, ${event.location.country}</p>
                            <div class="flex flex-wrap gap-2 mb-1">
                                ${tags.map(tag => `
                                    <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">${tag}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <a href="${event.link}" target="_blank" class="text-blue-500 hover:underline text-sm">Visit Website</a>
                        <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Add To Journey</button>
                    </div>
                `;
                
                // Show the popup
                const popup = document.getElementById('event-popup');
                popup.classList.remove('translate-y-full');
                popup.classList.remove('opacity-0');
                popup.classList.remove('pointer-events-none');
            }
            
            // Switch to map view
            listView.classList.add('translate-x-full');
            viewToggle.classList.remove('hidden');
            viewIcon.textContent = '📋';
            viewText.textContent = 'List View';
            currentView = 'map';
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
                ? '#10B981'  // Use emerald for ongoing events
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
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const daysToEvent = Math.round((eventDate - now) / (1000 * 60 * 60 * 24));
        const ongoing = isEventOngoing(event.date);
        const markerColor = ongoing ? '#10B981' : getEventColor(daysToEvent);
        const marker = L.circleMarker([event.location.lat, event.location.lng], {
            radius: ongoing ? 12 : 8,
            fillColor: markerColor,
            color: ongoing ? '#10B981' : markerColor,
            weight: ongoing ? 4 : 2,
            opacity: 1,
            fillOpacity: 0.85,
            isOngoing: ongoing,
            daysToEvent: daysToEvent,
            eventId: event.id // Add event ID to marker for filtering
        });
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
            popupContent.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-2xl font-bold">Logo</div>
                    <div>
                        <h3 class="font-bold text-xl mb-1">${event.name}</h3>
                        <p class="text-gray-600 text-sm mb-1">${event.short_description || ''}</p>
                        <p class="text-blue-700 text-base font-semibold mb-2">${formattedDate} &bull; ${event.location.city}, ${event.location.country}</p>
                        <div class="flex flex-wrap gap-2 mb-1">
                            ${event.tags.map(tag => `
                                <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <a href="${event.link}" target="_blank" class="text-blue-500 hover:underline text-sm">Visit Website</a>
                    <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">Add To Journey</button>
                </div>
            `;
            const popup = document.getElementById('event-popup');
            popup.classList.remove('translate-y-full');
            popup.classList.remove('opacity-0');
            popup.classList.remove('pointer-events-none');
        });
        marker.on('mouseover', function() {
            this.setStyle({
                fillColor: ongoing ? '#047857' : markerColor,
                fillOpacity: 1
            });
        });
        marker.on('mouseout', function() {
            this.setStyle({
                fillColor: ongoing ? '#10B981' : markerColor,
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
        const eventDate = new Date(event.date);
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

// Toggle sort order
sortToggle.addEventListener('click', function() {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    // Rotate the arrow icon
    this.querySelector('svg').style.transform = sortOrder === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)';
    // Re-render the list with new sort order
    if (filteredEvents.length > 0) {
        renderEventList(filteredEvents);
    }
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
    // 0 days = emerald (#10B981), 60+ days = indigo (#818cf8)
    const minDays = 0;
    const maxDays = 60;
    const clamped = Math.max(minDays, Math.min(maxDays, daysToEvent));
    const factor = 1 - (clamped / maxDays); // 1 = emerald, 0 = indigo
    return interpolateColor('818cf8', '10B981', factor); // indigo to emerald
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