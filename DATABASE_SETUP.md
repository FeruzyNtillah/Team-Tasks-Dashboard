# Database Setup Guide

This guide will help you set up the Supabase database for the Team Tasks Dashboard.

## Prerequisites

- You have a Supabase project created
- You have your Supabase URL and anon key

## Step 1: Set up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Step 2: Set up the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy and paste the contents of `Team-Tasks-Database/supabase-schema.sql`
4. Click **Run** to execute the schema

This will create:
- `users` table (extends auth.users)
- `projects` table
- `tasks` table
- `avatars` storage bucket
- Row Level Security (RLS) policies
- Storage policies for avatars
- Triggers and functions

## Step 3: Create Your First Admin User

The schema automatically creates a profile for new users with 'admin' role. To set up your first admin:

1. Sign up for a new account in your application
2. The first user will automatically get admin privileges
3. Subsequent users will get 'member' role by default

## Step 4: Verify Setup

1. Start your application:
   ```bash
   npm run dev
   ```

2. Sign in with your admin account
3. Navigate to the Projects page - you should see:
   - No "Failed to fetch user permissions" error
   - A "Create Project" button (admin only)

4. Navigate to the Tasks page - you should see:
   - Real project options in the dropdown
   - Real user options for assignment

## Troubleshooting

### "Failed to fetch user permissions" Error

This error occurs when:
1. The database schema isn't set up properly
2. RLS policies are blocking access
3. The user profile doesn't exist

**Solution:**
- Ensure you've run the SQL schema
- Check the Supabase logs for detailed errors
- The app will automatically create missing user profiles in the `users` table

### No "Create Project" Button

This happens when:
1. The user doesn't have admin role
2. Profile fetch failed

**Solution:**
- Ensure you're signed in as the first user (admin)
- Check browser console for errors
- Verify the user profile was created in the `users` table

### Empty Project/User Dropdowns

This happens when:
1. No projects exist yet
2. No users have signed up yet
3. RLS policies are blocking access

**Solution:**
- Create your first project as admin
- Sign up additional users to populate the user list
- Check RLS policies in Supabase

### Profile Picture Not Displaying

This happens when:
1. The `avatars` storage bucket doesn't exist
2. Storage policies are blocking access
3. No avatar has been uploaded

**Solution:**
- Ensure you've run the complete SQL schema (includes storage setup)
- Check the Storage section in Supabase dashboard
- Upload a profile picture from the Profile page
- Check browser console for storage errors

## Database Schema Overview

### Users Table
- Extends Supabase auth.users
- Stores user role (admin/member)
- Stores profile information
- References avatar files in storage

### Projects Table
- Project information and status
- Created by references auth.users
- Team members array

### Tasks Table
- Task details and assignments
- References projects table
- Status and priority tracking

## Security Notes

- Row Level Security (RLS) is enabled
- Admins can perform all operations
- Members can view all projects/tasks
- Members can only edit tasks assigned to them
- All operations require authentication
- Users can only access their own avatar files

## Next Steps

Once the database is set up:
1. Create your first project
2. Add tasks to the project
3. Invite team members
4. Start managing your team tasks!
