import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSessionManager } from '../hooks/useSessionManager';
import { useUserProfile } from '../hooks/useUserProfile';
import NotificationPanel from '../components/NotificationPanel';

/**
 * Top Bar Component
 * 
 * This component displays the top navigation bar with:
 * - Application title
 * - Notification icon with indicator
 * - User profile picture (with fallback to initials)
 * - Sign out button
 * 
 * Features:
 * - Responsive design with hover effects
 * - Profile picture fetched from user profile
 * - Automatic fallback to initials if no avatar
 * - Loading states for profile data
 */
const Topbar: React.FC = () => {
  const { user } = useAuth();
  const { clearSession } = useSessionManager();
  const { avatarUrl, loading, profile } = useUserProfile();
  const navigate = useNavigate();

  /**
   * Handles user sign out
   * Clears session and redirects to login page
   */
  const handleSignOut = async () => {
    await clearSession();
    navigate('/login');
  };

  /**
   * Handles profile navigation
   * Redirects to profile page
   */
  const handleProfileClick = () => {
    navigate('/profile');
  };

  /**
   * Gets user initials for fallback avatar
   * @returns string - User initials (max 2 characters)
   */
  const getUserInitials = (): string => {
    // Try to get initials from profile full_name first
    if (profile?.full_name) {
      const names = profile.full_name.trim().split(' ');
      if (names.length >= 2) {
        // First letter of first and last name
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      } else if (names.length === 1) {
        // First two letters of single name
        return names[0].substring(0, 2).toUpperCase();
      }
    }
    
    // Fallback to email if no profile name
    if (user?.email) {
      const email = user.email;
      const [name] = email.split('@');
      return name.substring(0, 2).toUpperCase();
    }
    
    // Final fallback
    return 'U';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Application Title */}
        <h1 className="text-2xl font-bold text-gray-800">Tech_Savy Company</h1>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <NotificationPanel />
          
          {/* Profile Picture */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 group"
            aria-label="Profile"
            title="View Profile"
          >
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            ) : avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <span class="text-blue-600 font-semibold text-sm">
                      ${getUserInitials()}
                    </span>
                  `;
                }}
              />
            ) : (
              <span className="text-blue-600 font-semibold text-sm bg-blue-50 w-full h-full flex items-center justify-center">
                {getUserInitials()}
              </span>
            )}
          </button>
          
          {/* Sign Out Button */}
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors group" 
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
            <span className="text-gray-600 group-hover:text-red-600 text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
