import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

/**
 * User Profile Hook
 * 
 * This hook fetches and manages the user's profile data including avatar URL.
 * It provides the profile information and loading states for components that need
 * to display user profile information like the topbar.
 * 
 * Features:
 * - Fetches user profile from the database
 * - Gets signed URL for avatar images
 * - Automatic refetch when user changes
 * - Error handling and loading states
 * 
 * Usage:
 * ```tsx
 * const { profile, loading, error, avatarUrl } = useUserProfile();
 * ```
 */
export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  /**
   * Helper function to get signed URL for avatar
   * @param path - The file path in Supabase storage
   * @returns Promise<string | null> - Signed URL or null if error
   */
  const getAvatarUrl = async (path: string | null): Promise<string | null> => {
    if (!path) return null;

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year expiry

      if (error) {
        console.error('Error getting signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Error getting avatar URL:', err);
      return null;
    }
  };

  /**
   * Fetches user profile data from the database
   */
  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If user profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating one...');
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || 'User',
              role: 'admin' // Make first user admin
            })
            .select('*')
            .single();
          
          if (createError) {
            console.error('Error creating user profile:', createError);
            setError('Failed to set up user profile');
            setProfile(null);
            setAvatarUrl('');
          } else if (newProfile) {
            setProfile(newProfile);
            // Get signed URL for avatar if it exists
            if (newProfile.avatar_url) {
              const signedUrl = await getAvatarUrl(newProfile.avatar_url);
              setAvatarUrl(signedUrl || '');
            } else {
              setAvatarUrl('');
            }
          }
        } else {
          setError('Failed to load profile');
          setProfile(null);
          setAvatarUrl('');
        }
      } else {
        setProfile(data);
        
        // Get signed URL for avatar if it exists
        if (data.avatar_url) {
          const signedUrl = await getAvatarUrl(data.avatar_url);
          setAvatarUrl(signedUrl || '');
        } else {
          setAvatarUrl('');
        }
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError('An unexpected error occurred');
      setProfile(null);
      setAvatarUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    avatarUrl,
    loading,
    error,
    refetch: fetchProfile,
  };
};
