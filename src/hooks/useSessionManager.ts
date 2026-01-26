import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useSessionManager = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    // Handle browser/tab close events
    const handleBeforeUnload = () => {
      // Sign out when browser is closing
      signOut();
    };

    // Handle visibility change (when user switches tabs or minimizes browser)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Optional: You can add logic here for when tab becomes hidden
        // But we don't want to sign out on tab switch, only on browser close
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [signOut]);

  // Function to manually clear session
  const clearSession = async () => {
    await signOut();
  };

  return {
    clearSession,
  };
};
