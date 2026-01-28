import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Session Manager Hook
 * 
 * This hook manages user session lifecycle by handling browser events
 * that may affect the authentication state. It provides automatic
 * session cleanup and manual session management capabilities.
 * 
 * Features:
 * - Automatic sign out on browser close
 * - Visibility change tracking (for future enhancements)
 * - Manual session clearing
 * - Event listener cleanup on unmount
 * 
 * Usage:
 * ```tsx
 * const { clearSession } = useSessionManager();
 * ```
 */
export const useSessionManager = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    /**
     * Handles browser/tab close events
     * Automatically signs out the user when the browser is closing
     * to ensure session security
     */
    const handleBeforeUnload = () => {
      // Sign out when browser is closing
      signOut();
    };

    /**
     * Handles visibility change events
     * Tracks when user switches tabs or minimizes the browser
     * Currently used for monitoring, can be extended for additional features
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Optional: You can add logic here for when tab becomes hidden
        // Examples: activity tracking, notification handling, etc.
        // But we don't want to sign out on tab switch, only on browser close
      }
    };

    // Add event listeners for session management
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners when component unmounts
    // Prevents memory leaks and unwanted behavior
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [signOut]);

  /**
   * Manually clears the user session
   * Can be called from components for explicit sign out
   * @returns Promise that resolves when sign out is complete
   */
  const clearSession = async () => {
    await signOut();
  };

  return {
    clearSession,
  };
};
