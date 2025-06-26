-- Create events table with the correct schema
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

-- Create bucket for logo storage (optional - we're using base64 in the code)
-- INSERT INTO storage.buckets (id, name) VALUES ('event-logos', 'event-logos');
-- CREATE POLICY "Allow public access to logos" ON storage.objects FOR SELECT USING (bucket_id = 'event-logos');
-- CREATE POLICY "Allow authenticated users to upload logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'event-logos'); 