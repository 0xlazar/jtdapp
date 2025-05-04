// Define world bounds
const worldBounds = [
    [-85, -180], // Southwest coordinates
    [85, 180]    // Northeast coordinates
];

// Initialize the map with restricted bounds and zoom
const map = L.map('map', {
    minZoom: 2,
    maxBounds: worldBounds,
    maxBoundsViscosity: 1.0
}).setView([20, 0], 2);

// Add CartoDB Positron tiles for English-only labeling
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> | &copy; OpenStreetMap contributors',
    noWrap: true
}).addTo(map);

// Get UI elements
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

// Function to show/hide loading state
function setLoading(isLoading) {
    loadingElement.classList.toggle('hidden', !isLoading);
    errorElement.classList.add('hidden');
}

// Function to show error
function showError() {
    loadingElement.classList.add('hidden');
    errorElement.classList.remove('hidden');
}

// Function to load events from JSON
async function loadEvents() {
    setLoading(true);
    try {
        const response = await fetch('data/events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLoading(false);
        return data.events;
    } catch (error) {
        console.error('Error loading events:', error);
        showError();
        return [];
    }
}

// Function to add markers to the map
function addEventMarkers(events) {
    events.forEach(event => {
        const marker = L.marker([event.location.lat, event.location.lng])
            .addTo(map)
            .bindPopup(`
                <h3 class="font-bold">${event.name}</h3>
                <p>${event.date}</p>
                <p>${event.location.city}, ${event.location.country}</p>
                <a href="${event.link}" target="_blank" class="text-blue-500 hover:underline">More Info</a>
            `);
    });
}

// Load and display events
loadEvents().then(events => {
    if (events.length > 0) {
        addEventMarkers(events);
        // Fit map bounds to show all markers
        const bounds = L.latLngBounds(events.map(event => [event.location.lat, event.location.lng]));
        map.fitBounds(bounds);
    }
}); 