// scripts/modules/ui.js - UI and interaction handling

/**
 * UI Module - Handles all user interface interactions and state management
 */

// UI state
let currentView = 'map'; // 'map' or 'list'
let currentEventListType = 'upcoming'; // 'upcoming' or 'past'
let isSearchActive = false;
let currentSearchTerm = '';

// DOM elements cache
const elements = {
    viewToggle: null,
    listView: null,
    eventsList: null,
    searchInput: null,
    searchIndicator: null,
    searchCount: null,
    upcomingBtn: null,
    pastBtn: null,
    hamburgerMenu: null,
    menuDropdown: null,
    welcomePopup: null,
    eventPopup: null,
    helpPopup: null,
    loadingElement: null,
    errorElement: null,
    mapNav: null
};

// Initialize UI module
function initializeUI() {
    cacheElements();
    setupEventListeners();
    setupWelcomePopup();
    setupEventToggle();
    updateEventToggleUI();
    updateFooterNav();
}

// Cache DOM elements for better performance
function cacheElements() {
    elements.viewToggle = document.getElementById('view-toggle');
    elements.listView = document.getElementById('list-view');
    elements.eventsList = document.getElementById('events-list');
    elements.searchInput = document.getElementById('search-input');
    elements.searchIndicator = document.getElementById('search-indicator');
    elements.searchCount = document.getElementById('search-count');
    elements.hamburgerMenu = document.getElementById('hamburger-menu');
    elements.menuDropdown = document.getElementById('menu-dropdown');
    elements.welcomePopup = document.getElementById('welcome-popup');
    elements.eventPopup = document.getElementById('event-popup');
    elements.helpPopup = document.getElementById('help-popup');
    elements.loadingElement = document.getElementById('loading');
    elements.errorElement = document.getElementById('error');
    elements.mapNav = document.getElementById('map-nav');
    
    // Get toggle buttons
    const eventToggle = document.getElementById('event-toggle');
    if (eventToggle) {
        const buttons = eventToggle.querySelectorAll('button');
        elements.upcomingBtn = buttons[0];
        elements.pastBtn = buttons[1];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    if (elements.hamburgerMenu && elements.menuDropdown) {
        elements.hamburgerMenu.addEventListener('click', function() {
            elements.menuDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!elements.hamburgerMenu.contains(e.target) && !elements.menuDropdown.contains(e.target)) {
                elements.menuDropdown.classList.add('hidden');
            }
        });
    }
    
    // Close buttons
    setupCloseButtons();
    
    // Coming soon buttons
    setupComingSoonButtons();
    
    // Help button
    setupHelpButton();
    
    // View toggle
    setupViewToggle();
    
    // Search functionality
    setupSearch();
}

// Setup close button functionality
function setupCloseButtons() {
    // Welcome popup close
    const closeWelcome = document.getElementById('close-welcome');
    const gotItButton = document.getElementById('got-it-button');
    
    if (closeWelcome) {
        closeWelcome.addEventListener('click', function() {
            elements.welcomePopup.classList.add('hidden');
            localStorage.setItem('welcomeSeen', 'true');
        });
    }
    
    if (gotItButton) {
        gotItButton.addEventListener('click', function() {
            elements.welcomePopup.classList.add('hidden');
            localStorage.setItem('welcomeSeen', 'true');
        });
    }
    
    // Event popup close
    const closePopup = document.getElementById('close-popup');
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            const popup = elements.eventPopup;
            popup.classList.add('translate-y-full');
            popup.classList.add('opacity-0');
            popup.classList.add('pointer-events-none');
        });
    }
    
    // List view close
    const closeList = document.getElementById('close-list');
    if (closeList) {
        closeList.addEventListener('click', function() {
            elements.listView.classList.add('translate-x-full');
            currentView = 'map';
            updateViewToggle();
            updateFooterNav();
        });
    }
    
    // Help popup close
    const closeHelp = document.getElementById('close-help');
    if (closeHelp) {
        closeHelp.addEventListener('click', hideHelpPopup);
    }
}

// Setup coming soon functionality
function setupComingSoonButtons() {
    const profileButton = document.getElementById('profile-button');
    const ecosystemButton = document.getElementById('ecosystem-button');
    
    if (profileButton) {
        profileButton.addEventListener('click', function() {
            showToast('Profiles coming soon!');
        });
    }
    
    if (ecosystemButton) {
        ecosystemButton.addEventListener('click', function() {
            showToast('Ecosystem Hub coming soon!');
        });
    }
}

// Setup help button functionality
function setupHelpButton() {
    const helpButton = document.getElementById('help-button');
    if (helpButton) {
        helpButton.addEventListener('click', function() {
            const helpPopup = elements.helpPopup;
            if (helpPopup.classList.contains('opacity-0')) {
                showHelpPopup();
            } else {
                hideHelpPopup();
            }
        });
    }
}

// Setup view toggle functionality
function setupViewToggle() {
    if (elements.viewToggle) {
        elements.viewToggle.addEventListener('click', function() {
            if (currentView === 'map') {
                currentView = 'list';
                elements.listView.classList.remove('translate-x-full');
            } else {
                currentView = 'map';
                elements.listView.classList.add('translate-x-full');
            }
            updateViewToggle();
            updateFooterNav();
        });
    }
    
    // Map navigation
    if (elements.mapNav) {
        elements.mapNav.addEventListener('click', function() {
            if (currentView === 'list') {
                currentView = 'map';
                elements.listView.classList.add('translate-x-full');
                updateViewToggle();
                updateFooterNav();
            }
        });
    }
}

// Setup search functionality
function setupSearch() {
    if (elements.searchInput) {
        // Debounced search
        let searchTimeout;
        elements.searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                currentSearchTerm = searchTerm;
                isSearchActive = searchTerm.length > 0;
                
                // Update search results
                if (window.updateSearchResults) {
                    window.updateSearchResults(searchTerm);
                }
                
                updateSearchIndicator();
                updateClearButton();
            }, 300);
        });
    }
    
    // Clear search button
    const clearSearch = document.getElementById('clear-search');
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            elements.searchInput.value = '';
            currentSearchTerm = '';
            isSearchActive = false;
            
            if (window.updateSearchResults) {
                window.updateSearchResults('');
            }
            
            updateSearchIndicator();
            updateClearButton();
        });
    }
}

// Setup welcome popup
function setupWelcomePopup() {
    if (!localStorage.getItem('welcomeSeen') && elements.welcomePopup) {
        elements.welcomePopup.classList.remove('hidden');
        
        // Close when clicking outside
        elements.welcomePopup.addEventListener('click', function(e) {
            if (e.target === elements.welcomePopup) {
                elements.welcomePopup.classList.add('hidden');
                localStorage.setItem('welcomeSeen', 'true');
            }
        });
    }
}

// Setup event toggle functionality
function setupEventToggle() {
    if (elements.upcomingBtn) {
        elements.upcomingBtn.addEventListener('click', () => {
            if (currentEventListType !== 'upcoming') {
                currentEventListType = 'upcoming';
                updateEventToggleUI();
                if (window.renderEventList && window.originalEvents) {
                    window.renderEventList(window.originalEvents);
                }
            }
        });
    }
    
    if (elements.pastBtn) {
        elements.pastBtn.addEventListener('click', () => {
            if (currentEventListType !== 'past') {
                currentEventListType = 'past';
                updateEventToggleUI();
                if (window.renderEventList && window.originalEvents) {
                    window.renderEventList(window.originalEvents);
                }
            }
        });
    }
}

// Update event toggle UI
function updateEventToggleUI() {
    if (!elements.upcomingBtn || !elements.pastBtn) return;
    
    if (currentEventListType === 'upcoming') {
        elements.upcomingBtn.classList.add('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        elements.upcomingBtn.classList.remove('text-gray-500');
        elements.upcomingBtn.disabled = true;
        elements.pastBtn.classList.remove('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        elements.pastBtn.classList.add('text-gray-500');
        elements.pastBtn.disabled = false;
    } else {
        elements.pastBtn.classList.add('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        elements.pastBtn.classList.remove('text-gray-500');
        elements.pastBtn.disabled = true;
        elements.upcomingBtn.classList.remove('bg-white', 'shadow', 'text-gray-900', 'font-semibold');
        elements.upcomingBtn.classList.add('text-gray-500');
        elements.upcomingBtn.disabled = false;
    }
}

// Update view toggle button
function updateViewToggle() {
    if (!elements.viewToggle) return;
    
    const viewIcon = elements.viewToggle.querySelector('svg');
    const viewText = document.getElementById('view-text');
    
    if (currentView === 'map') {
        viewText.textContent = 'Events List';
        // Update icon for list view
        viewIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        `;
    } else {
        viewText.textContent = 'Map View';
        // Update icon for map view
        viewIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        `;
    }
}

// Update footer navigation
function updateFooterNav() {
    if (!elements.mapNav) return;
    
    const mapNavText = elements.mapNav.querySelector('span');
    const mapNavIcon = elements.mapNav.querySelector('svg');
    
    if (currentView === 'map') {
        mapNavText.classList.add('gradient-text');
        mapNavIcon.classList.add('text-transparent');
        mapNavIcon.style.stroke = 'url(#footer-gradient)';
    } else {
        mapNavText.classList.remove('gradient-text');
        mapNavIcon.classList.remove('text-transparent');
        mapNavIcon.style.stroke = '';
    }
}

// Update search indicator
function updateSearchIndicator() {
    if (!elements.searchIndicator || !elements.searchCount) return;
    
    if (isSearchActive && currentSearchTerm.trim()) {
        elements.searchIndicator.classList.remove('hidden');
        const filteredCount = window.filteredEvents ? window.filteredEvents.length : 0;
        elements.searchCount.textContent = filteredCount;
        
        // Add animation
        elements.searchCount.classList.add('animate-pulse');
        setTimeout(() => {
            elements.searchCount.classList.remove('animate-pulse');
        }, 1000);
    } else {
        elements.searchIndicator.classList.add('hidden');
    }
}

// Update clear search button
function updateClearButton() {
    const clearSearch = document.getElementById('clear-search');
    if (clearSearch) {
        if (currentSearchTerm.trim()) {
            clearSearch.classList.remove('hidden');
        } else {
            clearSearch.classList.add('hidden');
        }
    }
}

// Show/hide loading state
function setLoading(isLoading) {
    if (elements.loadingElement) {
        elements.loadingElement.classList.toggle('hidden', !isLoading);
    }
    if (elements.errorElement) {
        elements.errorElement.classList.add('hidden');
    }
}

// Show error
function showError() {
    if (elements.loadingElement) {
        elements.loadingElement.classList.add('hidden');
    }
    if (elements.errorElement) {
        elements.errorElement.classList.remove('hidden');
    }
}

// Show help popup
function showHelpPopup() {
    if (elements.helpPopup) {
        elements.helpPopup.classList.remove('opacity-0');
        elements.helpPopup.classList.remove('pointer-events-none');
        elements.helpPopup.classList.add('opacity-100');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            hideHelpPopup();
        }, 10000);
    }
}

// Hide help popup
function hideHelpPopup() {
    if (elements.helpPopup) {
        elements.helpPopup.classList.add('opacity-0');
        elements.helpPopup.classList.add('pointer-events-none');
        elements.helpPopup.classList.remove('opacity-100');
    }
}

// Show toast notification
function showToast(message, duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Export functions for global access
window.UIModule = {
    initializeUI,
    setLoading,
    showError,
    showHelpPopup,
    hideHelpPopup,
    showToast,
    updateSearchIndicator,
    updateEventToggleUI,
    updateViewToggle,
    updateFooterNav,
    // Getters for state
    getCurrentView: () => currentView,
    getCurrentEventListType: () => currentEventListType,
    getIsSearchActive: () => isSearchActive,
    getCurrentSearchTerm: () => currentSearchTerm,
    // Setters for state
    setCurrentView: (view) => { currentView = view; },
    setCurrentEventListType: (type) => { currentEventListType = type; },
    setIsSearchActive: (active) => { isSearchActive = active; },
    setCurrentSearchTerm: (term) => { currentSearchTerm = term; }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUI);
} else {
    initializeUI();
}