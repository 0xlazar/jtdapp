// This script creates the necessary Supabase table structure
// Run this in the browser console when logged into Supabase

async function setupSupabaseTable() {
  try {
    console.log("Starting Supabase setup...");
    
    // Get Supabase client from the already loaded configuration
    const supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.URL,
      SUPABASE_CONFIG.ANON_KEY
    );
    
    // SQL to create the events table with proper structure
    // Using snake_case for all column names as that's Supabase's default convention
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
    
    // Execute the SQL query
    const { error } = await supabaseClient.rpc('pgclient_exec', { query: createTableSQL });
    
    if (error) {
      console.error("Error creating table:", error);
      return false;
    }
    
    console.log("✅ Table created successfully!");
    return true;
  } catch (error) {
    console.error("Setup failed:", error);
    return false;
  }
}

// Function to check if the table exists and has the right structure
async function checkSupabaseTable() {
  try {
    const supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.URL,
      SUPABASE_CONFIG.ANON_KEY
    );
    
    // Try to get a single row from the events table
    const { data, error } = await supabaseClient
      .from('events')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error("Error checking table:", error);
      return false;
    }
    
    console.log("✅ Table exists and is accessible");
    return true;
  } catch (error) {
    console.error("Table check failed:", error);
    return false;
  }
}

// Function to drop the table and start fresh
async function dropEventsTable() {
  try {
    const supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.URL,
      SUPABASE_CONFIG.ANON_KEY
    );
    
    const dropSQL = `DROP TABLE IF EXISTS events;`;
    
    const { error } = await supabaseClient.rpc('pgclient_exec', { query: dropSQL });
    
    if (error) {
      console.error("Error dropping table:", error);
      return false;
    }
    
    console.log("✅ Table dropped successfully");
    return true;
  } catch (error) {
    console.error("Failed to drop table:", error);
    return false;
  }
}

// Function to set up everything
async function runFullSetup() {
  console.log("🔄 Starting full Supabase setup...");
  
  // First drop the table if it exists
  await dropEventsTable();
  
  // Then create the table with the correct structure
  const setupSuccess = await setupSupabaseTable();
  
  if (setupSuccess) {
    console.log("✅ Supabase setup completed successfully!");
  } else {
    console.error("❌ Supabase setup failed");
  }
}

// Export the functions for use in the browser console
window.setupSupabase = {
  setup: setupSupabaseTable,
  check: checkSupabaseTable,
  drop: dropEventsTable,
  fullSetup: runFullSetup
}; 