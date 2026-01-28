import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

/**
 * Props interface for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication. It checks the user's
 * authentication status and either renders the protected content or redirects
 * to the login page.
 * 
 * Features:
 * - Shows loading spinner while checking authentication status
 * - Redirects to login page if user is not authenticated
 * - Renders children if user is authenticated
 * 
 * Usage:
 * ```tsx
 * <ProtectedRoute>
 *   <SomeProtectedComponent />
 * </ProtectedRoute>
 * ```
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
