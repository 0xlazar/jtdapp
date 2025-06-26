# Supabase Manual Setup Instructions

Since the automatic setup script is facing permission issues, here's how to manually set up your Supabase database:

## Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

## Step 2: Create the Events Table

Copy and paste the following SQL into the query editor:

```sql
-- Drop existing table if it exists
DROP TABLE IF EXISTS events;

-- Create events table with the correct schema
CREATE TABLE events (
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
```

## Step 3: Run the SQL Query

1. Click the "Run" button (or press Ctrl+Enter)
2. Wait for the query to complete

## Step 4: Verify the Table Structure

1. Go to "Table Editor" in the left sidebar
2. Find and click on the "events" table
3. Check that all columns are present with the correct names:
   - `name`
   - `description`
   - `city`
   - `country`
   - `start_date`
   - `end_date`
   - `event_type`
   - `event_url`
   - `is_conference_week`
   - `conference_week_url`
   - `has_hackathon`
   - `hackathon_url`
   - `is_free`
   - `is_ethereum_10`
   - `is_destino`
   - `has_volunteership`
   - `has_scholarship`
   - `contact_name`
   - `contact_email`
   - `contact_telegram`
   - `logo`
   - `status`
   - `submitted_at`
   - `updated_at`

## Step 5: Verify Row Level Security Policies

1. Go to "Authentication" > "Policies" in the left sidebar
2. Check that the "events" table has the following policies:
   - "Allow anonymous inserts"
   - "Allow users to view submissions"

## Step 6: Test the Form

1. Go back to your application
2. Fill out the event submission form
3. Submit the form
4. Check the Supabase "Table Editor" to verify the submission was saved 