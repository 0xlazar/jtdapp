// Admin Configuration
// Change the password below to secure your admin panel
const ADMIN_CONFIG = {
    // Default password - CHANGE THIS!
    PASSWORD: 'JediGovna2025!',
    
    // Session duration in hours
    SESSION_HOURS: 24,
    
    // Storage key (don't change unless you know what you're doing)
    STORAGE_KEY: 'jtd_admin_auth'
};

// Export for use in admin panel
window.ADMIN_CONFIG = ADMIN_CONFIG;
