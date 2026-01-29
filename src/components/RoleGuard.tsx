import React from 'react';
import type { Role } from '../utils/permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  forbiddenRoles?: Role[];
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * RoleGuard Component
 * 
 * Conditionally renders children based on user role.
 * This is a higher-order component that wraps other components
 * to provide role-based access control at the UI level.
 * 
 * Examples:
 * ```tsx
 * // Only show to admins
 * <RoleGuard allowedRoles={['admin']}>
 *   <DeleteButton />
 * </RoleGuard>
 * 
 * // Show to everyone except admins
 * <RoleGuard forbiddenRoles={['admin']}>
 *   <MemberOnlyContent />
 * </RoleGuard>
 * 
 * // Only show to authenticated users
 * <RoleGuard requireAuth>
 *   <UserDashboard />
 * </RoleGuard>
 * ```
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  forbiddenRoles,
  fallback = null,
  requireAuth = false
}) => {
  // This would typically come from a context or hook
  // For now, we'll assume it's passed as a prop or retrieved from context
  const userRole = null; // TODO: Get from auth context
  
  // If authentication is required and user is not authenticated
  if (requireAuth && !userRole) {
    return <>{fallback}</>;
  }
  
  // If user has a forbidden role
  if (forbiddenRoles && userRole && forbiddenRoles.includes(userRole)) {
    return <>{fallback}</>;
  }
  
  // If user doesn't have an allowed role
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <>{fallback}</>;
  }
  
  // User is authorized
  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: React.ReactNode;
  condition: boolean;
  fallback?: React.ReactNode;
}

/**
 * ConditionalRender Component
 * 
 * Simple conditional rendering component for more readable JSX
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  condition,
  fallback = null
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

interface PermissionGuardProps {
  children: React.ReactNode;
  hasPermission: boolean;
  fallback?: React.ReactNode;
  loading?: boolean;
  loadingFallback?: React.ReactNode;
}

/**
 * PermissionGuard Component
 * 
 * Renders children based on a permission check.
 * Useful for complex permission logic that doesn't fit
 * neatly into role-based checks.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  hasPermission,
  fallback = null,
  loading = false,
  loadingFallback = <div>Loading...</div>
}) => {
  if (loading) {
    return <>{loadingFallback}</>;
  }
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
};
