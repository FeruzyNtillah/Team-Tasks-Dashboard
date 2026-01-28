import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSessionManager } from '../hooks/useSessionManager';
import { useUserProfile } from '../hooks/useUserProfile';

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
  const { avatarUrl, loading } = useUserProfile();
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
   * Handles notifications click
   * Placeholder for future notifications functionality
   */
  const handleNotificationsClick = () => {
    // TODO: Implement notifications panel
    console.log('Notifications clicked');
  };

  /**
   * Gets user initials for fallback avatar
   * @returns string - User initials (max 2 characters)
   */
  const getUserInitials = (): string => {
    if (!user?.email) return 'U';
    
    const email = user.email;
    const [name] = email.split('@');
    
    // Return first two characters of the name part
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Application Title */}
        <h1 className="text-2xl font-bold text-gray-800">Team Tasks Dashboard</h1>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications Icon */}
          <button 
            onClick={handleNotificationsClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group" 
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            {/* Notification Indicator */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
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
            className="p-2 rounded-lg hover:bg-red-50 transition-colors group" 
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
