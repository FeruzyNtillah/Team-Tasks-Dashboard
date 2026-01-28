import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that required environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

/**
 * Supabase client instance
 * 
 * This is the main Supabase client used throughout the application for:
 * - Authentication (sign up, sign in, password reset)
 * - Database operations (CRUD operations)
 * - Real-time subscriptions
 * 
 * The client is configured with the anonymous key for client-side operations.
 * Server-side operations should use the service role key.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
