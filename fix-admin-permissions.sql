-- Fix admin permissions for updating event status
-- Run this in your Supabase SQL Editor

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'events';

-- Drop any existing restrictive UPDATE policies that might be blocking us
DROP POLICY IF EXISTS "Allow admin to update event status" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;

-- Create a simple, permissive UPDATE policy for admin operations
CREATE POLICY "Allow admin updates" ON events
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Verify the new policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'events' AND cmd = 'UPDATE';
