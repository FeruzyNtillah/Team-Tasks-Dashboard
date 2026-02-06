import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSessionManager } from '../hooks/useSessionManager';
import { useUserProfile } from '../hooks/useUserProfile';
import NotificationPanel from '../components/NotificationPanel';
import techLogo from '../assets/tech.jpg';

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
 * - Clean shadcn component styling
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 md:py-4">
        {/* Application Logo and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <img 
            src={techLogo} 
            alt="ImaraTech Logo" 
            className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-cover shrink-0 shadow-sm hover:shadow-md transition-shadow duration-200"
          />
          <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:block">ImaraTech</h1>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Notifications */}
          <NotificationPanel />
          
          {/* Profile Picture Button */}
          <button 
            onClick={handleProfileClick}
            className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-slate-200/70 hover:border-blue-400 transition-all duration-200 shrink-0 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Profile"
            title="View Profile"
          >
            {loading ? (
              <div className="w-full h-full bg-linear-to-r from-slate-200 to-slate-300 animate-pulse rounded-full" />
            ) : avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <span class="text-blue-600 font-semibold text-xs md:text-sm bg-blue-50 w-full h-full flex items-center justify-center rounded-full">
                      ${getUserInitials()}
                    </span>
                  `;
                }}
              />
            ) : (
              <span className="text-blue-600 font-semibold text-xs md:text-sm bg-linear-to-br from-blue-50 to-blue-100 w-full h-full flex items-center justify-center rounded-full">
                {getUserInitials()}
              </span>
            )}
          </button>
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
