// scripts/main.js

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

// Initialize the Leaflet map in the dedicated map container
const map = L.map('map', {
    center: [20, 0], // Center of the world
    zoom: 2,
    minZoom: 2,
    maxBounds: [
        [-85, -180],
        [85, 180]
    ],
    maxBoundsViscosity: 1.0
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

// Function to load events from JSON
async function loadEvents() {
    setLoading(true);
    try {
        // Add timestamp and random number to prevent caching
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
        return data.events;
    } catch (err) {
        console.error('Error loading events:', err);
        showError();
        return [];
    }
}

// Function to add markers to the map
function addEventMarkers(events) {
    console.log('Adding markers for events:', events.length);

    // Create a marker cluster group
    const markers = L.markerClusterGroup({
        // Customize cluster appearance
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">${count}</div>`,
                className: 'custom-cluster',
                iconSize: L.point(32, 32)
            });
        }
    });

    events.forEach(event => {
        console.log('Processing event:', event.name);

        // Create a circle marker
        const marker = L.circleMarker([event.location.lat, event.location.lng], {
            radius: 8,
            fillColor: "#3B82F6", // Tailwind blue-500
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add click handler to show floating window
        marker.on('click', function() {
            const popupContent = document.getElementById('popup-content');
            popupContent.innerHTML = `
                <div class="text-center">
                    <img src="${event.logo}" 
                         alt="${event.name} logo" 
                         class="mx-auto mb-2" 
                         style="width:64px;height:64px;object-fit:contain;"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/64?text=${encodeURIComponent(event.name)}';">
                    <h3 class="font-bold text-lg">${event.name}</h3>
                    <p class="text-gray-600">${event.date}</p>
                    <p class="text-gray-600">${event.location.city}, ${event.location.country}</p>
                    <a href="${event.link}" target="_blank" class="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Visit Website</a>
                </div>
            `;
            
            const popup = document.getElementById('event-popup');
            popup.classList.remove('translate-y-full');
            popup.classList.remove('opacity-0');
            popup.classList.remove('pointer-events-none');
        });

        // Add hover effect
        marker.on('mouseover', function() {
            this.setStyle({
                fillColor: "#2563EB", // Tailwind blue-600
                fillOpacity: 1
            });
        });
        marker.on('mouseout', function() {
            this.setStyle({
                fillColor: "#3B82F6", // Tailwind blue-500
                fillOpacity: 0.8
            });
        });

        // Add marker to cluster group
        markers.addLayer(marker);
    });

    // Add the cluster group to the map
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