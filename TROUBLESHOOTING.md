# Troubleshooting Guide

## "Failed to create project" Error

This error can occur for several reasons. Here's how to diagnose and fix it:

### 1. Check Browser Console

Open your browser's developer console (F12) and look for specific error messages when you try to create a project. Common errors include:

- **Permission denied**: User doesn't have admin role
- **Relation "users" does not exist**: Database schema not set up
- **Insert permission denied**: RLS policies blocking access
- **Network error**: Supabase connection issues

### 2. Common Causes and Solutions

#### **Cause: User doesn't have admin permissions**
**Symptoms**: "Insufficient permissions to create projects" error
**Solution**:
1. Check if you're signed in as the first user (admin)
2. Verify the user profile was created in the `users` table
3. Check the `role` field in the `users` table

```sql
-- Check your user role
SELECT id, email, role FROM users WHERE id = 'your-user-id';
```

#### **Cause: Database schema not set up**
**Symptoms**: "relation "users" does not exist" or similar table errors
**Solution**:
1. Run the complete SQL schema from `Team-Tasks-Database/supabase-schema.sql`
2. Ensure all tables, policies, and triggers are created

#### **Cause: RLS (Row Level Security) policies blocking access**
**Symptoms**: "Insert permission denied" or "Select permission denied"
**Solution**:
1. Check RLS policies in Supabase dashboard
2. Ensure policies allow admins to create projects
3. Verify user authentication is working

#### **Cause: Missing required fields**
**Symptoms**: Form validation error or "Please fill in all fields"
**Solution**:
1. Ensure both project name and description are filled
2. Check that the status field has a valid value

#### **Cause: Supabase connection issues**
**Symptoms**: Network errors or timeout errors
**Solution**:
1. Verify your `.env` file has correct Supabase URL and anon key
2. Check your internet connection
3. Verify Supabase project is active

### 3. Debugging Steps

1. **Open Browser Console**: Press F12 and check the Console tab
2. **Try creating a project**: Note the exact error message
3. **Check Network tab**: Look for failed API requests
4. **Verify user role**: Check if you have admin permissions
5. **Test database connection**: Try fetching existing projects first

### 4. Quick Fixes

#### **Fix 1: Reset User Profile**
If your user profile wasn't created correctly:

```sql
-- Delete and recreate your user profile
DELETE FROM users WHERE id = 'your-user-id';

-- The app will automatically recreate it when you refresh
```

#### **Fix 2: Check RLS Policies**
Ensure RLS policies are correctly set up:

```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Recreate policies if needed (run from schema file)
```

#### **Fix 3: Verify Environment Variables**
Check your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Common Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Insufficient permissions to create projects" | User not admin | Check user role in users table |
| "relation "users" does not exist" | Schema not set up | Run SQL schema |
| "Insert permission denied" | RLS policy issue | Check RLS policies |
| "Failed to fetch user permissions" | Profile missing | App will auto-create |
| "Network request failed" | Connection issue | Check env variables |

### 6. Testing the Fix

After applying a fix:

1. Refresh the page
2. Try creating a project again
3. Check console for any new errors
4. Verify the project appears in the list

### 7. Getting Help

If you're still stuck:

1. **Check the console**: Copy the exact error message
2. **Verify database setup**: Ensure schema was run completely
3. **Check user permissions**: Confirm you have admin role
4. **Test connection**: Try accessing other pages first

### 8. Prevention

To avoid future issues:

1. **Always run the complete schema** when setting up
2. **Use the first user as admin** for initial setup
3. **Keep your Supabase credentials updated**
4. **Monitor console for warnings** during development
