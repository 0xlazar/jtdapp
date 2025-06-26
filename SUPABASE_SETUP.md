# Supabase Setup for Event Submissions

This document outlines how to set up Supabase to handle event submissions from the Journey to DevConnect application.

## 1. Create a Supabase Project

1. Sign up or login at [Supabase](https://supabase.com/)
2. Create a new project with your preferred settings
3. Once your project is ready, navigate to the project dashboard

## 2. Create Database Tables

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of the `setup-supabase-tables.sql` file from this repository
3. Paste the SQL code into the SQL Editor and click "Run"

If you prefer to create the table manually, use this SQL:

```sql
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

-- Create policy to allow authenticated users to select their own submissions
CREATE POLICY "Allow users to view their submissions" ON events
  FOR SELECT
  TO authenticated
  USING (true);
```

## 3. Verify the Setup

After running the SQL script:

1. Go to the "Table Editor" in your Supabase dashboard
2. Check that the `events` table has been created with all the necessary columns
3. Go to "Authentication" > "Policies" to verify that the Row Level Security policies have been applied correctly

## 4. Test the Integration

1. Fill out the event submission form
2. Submit the form
3. Check your Supabase dashboard to confirm the data was inserted correctly:
   - Go to "Table Editor" > "events"
   - You should see your new event listed with a status of "pending"

## Troubleshooting

If you encounter errors when submitting:

1. Check the browser console for specific error messages
2. Verify that your table schema matches exactly with the expected field names
3. Ensure you have properly configured the Supabase URL and anon key in `scripts/supabase-config.js`

## Moderation Workflow

The submission form sets all events with a `status` of 'pending'. You can build an admin panel to:

1. Review pending submissions
2. Approve submissions (set status to 'approved')
3. Reject submissions (set status to 'rejected')

Approved events can then be displayed on the main application. 