import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Session Manager Hook
 * 
 * This hook manages user session lifecycle by handling browser events
 * and development server lifecycle. It provides automatic session cleanup
 * and manual session management capabilities.
 * 
 * Features:
 * - Automatic sign out on browser close
 * - Session cleanup on development server restart
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
     * Handles page visibility changes
     * Detects when the page becomes hidden (server restart, tab switch, etc.)
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // When page becomes hidden, store a timestamp
        // This helps detect if the server was restarted
        sessionStorage.setItem('pageHiddenTime', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        // When page becomes visible again, check if server was restarted
        const pageHiddenTime = sessionStorage.getItem('pageHiddenTime');
        
        if (pageHiddenTime) {
          const hiddenDuration = Date.now() - parseInt(pageHiddenTime);
          
          // If page was hidden for more than 5 seconds, assume server restart
          // This is a heuristic to detect dev server restarts
          if (hiddenDuration > 5000) {
            console.log('Detected potential server restart, clearing session');
            signOut();
          }
          
          // Clear the stored timestamp
          sessionStorage.removeItem('pageHiddenTime');
        }
      }
    };

    /**
     * Handles connection events to detect server restarts
     * This is particularly useful for development environments
     */
    const handleConnectionChange = () => {
      if (!navigator.onLine) {
        // When connection is lost, store timestamp
        sessionStorage.setItem('connectionLostTime', Date.now().toString());
      } else {
        // When connection is restored, check if it was a server restart
        const connectionLostTime = sessionStorage.getItem('connectionLostTime');
        
        if (connectionLostTime) {
          const lostDuration = Date.now() - parseInt(connectionLostTime);
          
          // If connection was lost for more than 3 seconds, clear session
          // This helps detect when the dev server restarts
          if (lostDuration > 3000) {
            console.log('Connection restored after server restart, clearing session');
            signOut();
          }
          
          sessionStorage.removeItem('connectionLostTime');
        }
      }
    };

    /**
     * Handles development server heartbeat
     * Monitors if the development server is still responsive
     */
    const checkServerHealth = async () => {
      try {
        // Try to fetch a simple health check endpoint
        await fetch('/health', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        // If we can reach the server, server is running
        sessionStorage.removeItem('serverDownTime');
      } catch {
        // If we can't reach the server, mark it as down
        if (!sessionStorage.getItem('serverDownTime')) {
          sessionStorage.setItem('serverDownTime', Date.now().toString());
        }
      }
    };

    // Add event listeners for session management
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Set up periodic server health check in development
    let healthCheckInterval: number;
    
    if (import.meta.env.DEV) {
      // Check server health every 10 seconds in development
      healthCheckInterval = window.setInterval(checkServerHealth, 10000);
      
      // Initial health check
      checkServerHealth();
    }

    // Cleanup event listeners and intervals when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
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
