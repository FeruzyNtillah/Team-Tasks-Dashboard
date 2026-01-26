import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Save, AlertCircle, CheckCircle } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Helper function to get signed URL for avatar
  const getAvatarUrl = async (path: string | null) => {
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
      console.error('Error:', err);
      return null;
    }
  };

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating new profile...');
        
        try {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                full_name: user.user_metadata?.full_name || '',
                email: user.email || '',
                role: 'user'
              }
            ]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            setError('Failed to create profile');
          } else {
            // Fetch the newly created profile
            const { data: newData, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single();
              
            if (fetchError) {
              console.error('Error fetching new profile:', fetchError);
              setError('Failed to load profile');
            } else {
              setProfile(newData);
              setFullName(newData.full_name || '');
              
              // Get signed URL for avatar
              if (newData.avatar_url) {
                const signedUrl = await getAvatarUrl(newData.avatar_url);
                setAvatarUrl(signedUrl || '');
              } else {
                setAvatarUrl('');
              }
            }
          }
        } catch (err) {
          console.error('Error creating profile:', err);
          setError('Failed to create profile');
        }
        return;
      }

      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } else {
        setProfile(data);
        setFullName(data.full_name || '');
        
        // Get signed URL for avatar
        if (data.avatar_url) {
          const signedUrl = await getAvatarUrl(data.avatar_url);
          setAvatarUrl(signedUrl || '');
        } else {
          setAvatarUrl('');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const uploadAvatar = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      // Return the file path (not the URL)
      return filePath;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      setAvatarFile(file);
      const preview = URL.createObjectURL(file);
      setAvatarUrl(preview);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      let newAvatarPath = profile.avatar_url;

      // Upload new avatar if file is selected
      if (avatarFile) {
        const uploadedPath = await uploadAvatar(avatarFile);
        if (uploadedPath) {
          newAvatarPath = uploadedPath;
        } else {
          setError('Failed to upload avatar');
          setSaving(false);
          return;
        }
      }

      // Update profile with the file path
      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          avatar_url: newAvatarPath,
        })
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage('Profile updated successfully!');
        setEditing(false);
        setAvatarFile(null);
        // Refresh profile data
        await fetchProfile();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setEditing(false);
    setFullName(profile?.full_name || '');
    
    // Restore original avatar URL
    if (profile?.avatar_url) {
      const signedUrl = await getAvatarUrl(profile.avatar_url);
      setAvatarUrl(signedUrl || '');
    } else {
      setAvatarUrl('');
    }
    
    setAvatarFile(null);
    setError('');
    setMessage('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {message && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{message}</h3>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-2xl font-bold">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                <Camera className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 px-1"
                aria-label="Full name"
                placeholder="Enter your full name"
              />
            ) : (
              <h3 className="text-2xl font-semibold text-gray-800">{profile.full_name}</h3>
            )}
            <p className="text-gray-600 capitalize">{profile.role}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Account Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{profile.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Account Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email Verified:</span>
                <span className="font-medium text-green-600">Yes</span>
              </div>
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;