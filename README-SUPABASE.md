# Setting Up Supabase for Event Submissions

## Quick Setup Guide

1. **Create a Supabase Account and Project**
   - Go to [Supabase](https://supabase.com/) and sign up or log in
   - Create a new project with your preferred name and settings

2. **Run the Database Setup Script**
   - In your Supabase dashboard, go to the SQL Editor
   - Open the `setup-supabase-tables.sql` file from this repository
   - Copy the entire SQL script
   - Paste it into the SQL Editor in Supabase and click "Run"

3. **Update Configuration**
   - Get your project URL and anon key from Supabase Settings > API
   - Open `scripts/supabase-config.js` and update the values
   - Make sure to use string quotes around the values

4. **Test the Integration**
   - Fill out the event submission form and click "Submit Event"
   - Check your Supabase dashboard under Table Editor > events
   - You should see your new event submission with a status of "pending"

## Troubleshooting

If submissions are failing, check the following:

1. The browser console for specific error messages
2. Verify your Supabase URL and anon key are correctly configured
3. Ensure the table structure in Supabase matches the field names used in the code

For more detailed setup instructions, see `SUPABASE_SETUP.md`. 