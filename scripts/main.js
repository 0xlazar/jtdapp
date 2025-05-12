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
    worldCopyJump: true
});

// Add a basic tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    noWrap: true
}).addTo(map);

// Add close button functionality for the event popup
document.getElementById('close-popup').addEventListener('click', function() {
    const popup = document.getElementById('event-popup');
    popup.classList.add('translate-y-full');
    popup.classList.add('opacity-0');
    popup.classList.add('pointer-events-none');
});

// List View functionality
let currentView = 'map'; // 'map' or 'list'
const viewToggle = document.getElementById('view-toggle');
const viewIcon = document.getElementById('view-icon');
const viewText = document.getElementById('view-text');
const listView = document.getElementById('list-view');
const closeList = document.getElementById('close-list');
const eventsList = document.getElementById('events-list');

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
});

// Function to render event list
function renderEventList(events) {
    // Sort events by date ascending
    events = events.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    // Store events globally
    window.currentEvents = events;
    
    eventsList.innerHTML = events.map(event => {
        // Format date as 'Month Day'
        const eventDate = new Date(event.date);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = eventDate.toLocaleDateString(undefined, options);
        
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
                        <!-- Tags placeholder -->
                        <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Tag</span>
                        <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Conference</span>
                        <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Free</span>
                        <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Volunteership</span>
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
            
            // Switch to map view
            listView.classList.add('translate-x-full');
            viewToggle.classList.remove('hidden');
            viewIcon.textContent = '📋';
            viewText.textContent = 'List View';
            currentView = 'map';
        });
    });
}

// Modify the loadEvents function to also render the list
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
        data.events.forEach(event => {
            console.log('Event details:', {
                name: event.name,
                date: event.date,
                location: event.location
            });
        });
        setLoading(false);
        
        // Render the list view
        renderEventList(data.events);
        
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
    // 0 days = green (#10B981), 60+ days = purple (#7c3aed)
    const minDays = 0;
    const maxDays = 60;
    const clamped = Math.max(minDays, Math.min(maxDays, daysToEvent));
    const factor = 1 - (clamped / maxDays); // 1 = green, 0 = purple
    return interpolateColor('7c3aed', '10B981', factor); // purple to green
}

// Function to add markers to the map
function addEventMarkers(events) {
    console.log('Adding markers for events:', events.length);

    // Create a marker cluster group
    const markers = L.markerClusterGroup({
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
                ? '#10B981'
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
            color: ongoing ? '#10B981' : '#fff',
            weight: ongoing ? 4 : 2,
            opacity: 1,
            fillOpacity: 0.85,
            isOngoing: ongoing,
            daysToEvent: daysToEvent
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
                            <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Tag</span>
                            <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Conference</span>
                            <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Free</span>
                            <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Volunteership</span>
                            <span class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Community Hub</span>
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
                fillColor: ongoing ? '#059669' : markerColor,
                fillOpacity: 1
            });
        });
        marker.on('mouseout', function() {
            this.setStyle({
                fillColor: ongoing ? '#10B981' : markerColor,
                fillOpacity: 0.85
            });
        });
        markers.addLayer(marker);
    });
    map.addLayer(markers);
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