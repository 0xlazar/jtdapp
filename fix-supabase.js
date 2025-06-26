// This script will directly fix your Supabase database structure
// Copy and paste this entire file into your browser console while on your app

// Your Supabase configuration
const SUPABASE_CONFIG = {
    URL: 'https://otbtstuphxrvkqlejytq.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YnRzdHVwaHhydmtxbGVqeXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTk2NzEsImV4cCI6MjA2NDA5NTY3MX0.iXlHAUj1NlbVvk9slXbcFqjx9AbTBpvsM4OeS9lMp2o'
};

// Function to create Supabase client
async function createSupabaseClient() {
    // Check if supabase is already loaded
    if (!window.supabase) {
        console.log("Loading Supabase client...");
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                console.log("Supabase client loaded successfully");
                const client = window.supabase.createClient(
                    SUPABASE_CONFIG.URL,
                    SUPABASE_CONFIG.ANON_KEY
                );
                resolve(client);
            };
            script.onerror = (err) => {
                reject(new Error("Failed to load Supabase client: " + err));
            };
            document.head.appendChild(script);
        });
    } else {
        console.log("Using existing Supabase client");
        return window.supabase.createClient(
            SUPABASE_CONFIG.URL,
            SUPABASE_CONFIG.ANON_KEY
        );
    }
}

// Function to check if a table exists
async function tableExists(supabase, tableName) {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('count(*)')
            .limit(1);
            
        if (error) {
            console.error("Error checking table:", error);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error checking table:", error);
        return false;
    }
}

// Function to drop the events table
async function dropEventsTable(supabase) {
    try {
        const { error } = await supabase.rpc('pg_advisory_lock', { key: 123456 });
        if (error) {
            console.error("Advisory lock error:", error);
            // Continue anyway
        }
        
        const { error: dropError } = await supabase.rpc('pgclient_exec', { 
            query: 'DROP TABLE IF EXISTS events CASCADE;' 
        });
        
        if (dropError) {
            console.error("Error dropping table:", dropError);
            return false;
        }
        
        console.log("✓ Events table dropped successfully");
        
        await supabase.rpc('pg_advisory_unlock', { key: 123456 });
        return true;
    } catch (error) {
        console.error("Failed to drop table:", error);
        return false;
    }
}

// Function to create the events table with the correct structure
async function createEventsTable(supabase) {
    try {
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            city TEXT NOT NULL,
            country TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            event_type TEXT NOT NULL,
            event_url TEXT,
            is_conference_week BOOLEAN DEFAULT FALSE,
            conference_week_url TEXT,
            has_hackathon BOOLEAN DEFAULT FALSE,
            hackathon_url TEXT,
            is_free BOOLEAN DEFAULT FALSE,
            is_ethereum_10 BOOLEAN DEFAULT FALSE,
            is_destino BOOLEAN DEFAULT FALSE,
            has_volunteership BOOLEAN DEFAULT FALSE,
            has_scholarship BOOLEAN DEFAULT FALSE,
            contact_name TEXT,
            contact_email TEXT,
            contact_telegram TEXT,
            logo TEXT,
            status TEXT DEFAULT 'pending',
            submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Enable row level security
        ALTER TABLE events ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow anonymous inserts
        CREATE POLICY "Allow anonymous inserts" ON events
            FOR INSERT
            TO anon
            WITH CHECK (true);
            
        -- Create policy to allow authenticated users to select
        CREATE POLICY "Allow users to view submissions" ON events
            FOR SELECT
            TO authenticated
            USING (true);
        `;
        
        const { error } = await supabase.rpc('pgclient_exec', { query: createTableSQL });
        
        if (error) {
            console.error("Error creating table:", error);
            return false;
        }
        
        console.log("✓ Events table created successfully");
        return true;
    } catch (error) {
        console.error("Failed to create table:", error);
        return false;
    }
}

// Main function to fix Supabase
async function fixSupabase() {
    console.log("Starting Supabase database fix...");
    
    try {
        // Create Supabase client
        const supabase = await createSupabaseClient();
        
        // Check if events table exists
        const exists = await tableExists(supabase, 'events');
        console.log(`Events table exists: ${exists}`);
        
        // Drop existing table if it exists
        if (exists) {
            await dropEventsTable(supabase);
        }
        
        // Create table with correct structure
        const success = await createEventsTable(supabase);
        
        if (success) {
            console.log("✓ Supabase database fix completed successfully!");
            console.log("You can now go back to the submit form and try again.");
            return true;
        } else {
            console.error("✗ Failed to fix Supabase database");
            return false;
        }
    } catch (error) {
        console.error("Error fixing Supabase:", error);
        return false;
    }
}

// Export the function for direct use in the console
window.fixSupabase = fixSupabase;

// Provide instructions
console.log('=== Supabase Database Fix Script ===');
console.log('Run this command to fix your database:');
console.log('  fixSupabase()');
console.log('This will create the events table with the correct column names.');
console.log('WARNING: This will delete any existing data in the events table!'); 