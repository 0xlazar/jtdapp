// Supabase events handler

// Supabase configuration
const SUPABASE_CONFIG = {
    URL: 'https://otbtstuphxrvkqlejytq.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YnRzdHVwaHhydmtxbGVqeXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTk2NzEsImV4cCI6MjA2NDA5NTY3MX0.iXlHAUj1NlbVvk9slXbcFqjx9AbTBpvsM4OeS9lMp2o'
};

// Initialize Supabase client
let supabaseClient;

// Function to initialize Supabase
function initSupabase() {
    if (!window.supabase) {
        console.error("Supabase JS client not loaded");
        return false;
    }
    
    try {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
        return true;
    } catch (error) {
        console.error("Error initializing Supabase client:", error);
        return false;
    }
}

// Function to fetch events from Supabase
async function fetchEvents() {
    if (!supabaseClient) {
        if (!initSupabase()) {
            console.error("Could not initialize Supabase client");
            return [];
        }
    }
    
    try {
        // Only fetch approved events
        const { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .eq('status', 'approved');
            
        if (error) {
            console.error("Error fetching events from Supabase:", error);
            return [];
        }
        
        // Transform Supabase data to match the expected format
        const formattedEvents = data.map((event, index) => {
            return {
                id: event.id || index + 1,
                name: event.name,
                date: event.start_date,  // Using start_date as the main date
                end_date: event.end_date,
                location: {
                    // We'll need to add geocoding later, for now use dummy coordinates
                    lat: Math.random() * 180 - 90,  // Random latitude between -90 and 90
                    lng: Math.random() * 360 - 180, // Random longitude between -180 and 180
                    city: event.city,
                    country: event.country
                },
                link: event.event_url,
                logo: event.logo,
                short_description: event.description || "No description available",
                tags: generateTagsFromEvent(event)
            };
        });
        
        console.log("Fetched events from Supabase:", formattedEvents);
        return formattedEvents;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

// Function to generate tags from event properties
function generateTagsFromEvent(event) {
    const tags = [];
    
    // Add event type
    if (event.event_type) {
        tags.push(event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1));
    }
    
    // Add other tags based on boolean properties
    if (event.is_free) tags.push("Free");
    if (event.is_ethereum_10) tags.push("Ethereum 10y");
    if (event.is_destino) tags.push("Destino");
    if (event.has_volunteership) tags.push("Volunteership");
    if (event.has_scholarship) tags.push("Scholarship");
    if (event.has_hackathon) tags.push("Hackathon");
    if (event.is_conference_week) tags.push("Conference Week");
    
    return tags;
}

// Function to approve an event (for admin use)
async function approveEvent(eventId) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            console.error("Could not initialize Supabase client");
            return false;
        }
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('events')
            .update({ status: 'approved' })
            .eq('id', eventId);
            
        if (error) {
            console.error("Error approving event:", error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error approving event:", error);
        return false;
    }
}

// Function to reject an event (for admin use)
async function rejectEvent(eventId) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            console.error("Could not initialize Supabase client");
            return false;
        }
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('events')
            .update({ status: 'rejected' })
            .eq('id', eventId);
            
        if (error) {
            console.error("Error rejecting event:", error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error rejecting event:", error);
        return false;
    }
}

// Export the functions for use in other scripts
window.supabaseEvents = {
    fetchEvents,
    approveEvent,
    rejectEvent
}; 