-- Complete fix for admin permissions
-- Run this step by step in your Supabase SQL Editor

-- Step 1: Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'events';

-- Step 2: Drop ALL existing policies on events table and recreate them properly
DROP POLICY IF EXISTS "Allow anonymous inserts" ON events;
DROP POLICY IF EXISTS "Allow public to view events" ON events;
DROP POLICY IF EXISTS "Allow users to view their submissions" ON events;
DROP POLICY IF EXISTS "Allow admin to update event status" ON events;
DROP POLICY IF EXISTS "Allow admin updates" ON events;

-- Step 3: Recreate all policies with proper permissions
-- Allow anonymous users to insert new events (for submissions)
CREATE POLICY "Allow event submissions" ON events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow everyone to read events
CREATE POLICY "Allow reading events" ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow updating events (for admin approval/rejection)
CREATE POLICY "Allow event updates" ON events
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Step 4: Verify all policies are created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'events'
ORDER BY cmd, policyname;

-- Step 5: Test if RLS is properly enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'events';
