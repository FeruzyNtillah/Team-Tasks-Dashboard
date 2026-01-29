import React from 'react';
import { Button } from './Button';
import type { Role } from '../utils/permissions';

interface PermissionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  allowedRoles?: Role[];
  forbiddenRoles?: Role[];
  hasPermission?: boolean;
  fallback?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * PermissionButton Component
 * 
 * A button that only renders and functions if the user has the required permissions.
 * Combines role-based access control with button functionality.
 * 
 * Examples:
 * ```tsx
 * // Only show to admins
 * <PermissionButton 
 *   allowedRoles={['admin']}
 *   onClick={handleDelete}
 *   variant="danger"
 * >
 *   Delete Project
 * </PermissionButton>
 * 
 * // Custom permission check
 * <PermissionButton
 *   hasPermission={canEditTask}
 *   onClick={handleEdit}
 * >
 *   Edit Task
 * </PermissionButton>
 * ```
 */
export const PermissionButton: React.FC<PermissionButtonProps> = ({
  children,
  allowedRoles,
  forbiddenRoles,
  hasPermission,
  fallback = null,
  onClick,
  loading = false,
  disabled = false,
  ...buttonProps
}) => {
  // This would typically come from a context or hook
  const userRole = null; // TODO: Get from auth context
  
  // Check if user is authorized
  const isAuthorized = React.useMemo(() => {
    // If explicit permission is provided, use that
    if (hasPermission !== undefined) {
      return hasPermission;
    }
    
    // If user has a forbidden role
    if (forbiddenRoles && userRole && forbiddenRoles.includes(userRole)) {
      return false;
    }
    
    // If user doesn't have an allowed role
    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      return false;
    }
    
    return true;
  }, [hasPermission, allowedRoles, forbiddenRoles, userRole]);
  
  // If not authorized, show fallback
  if (!isAuthorized) {
    return <>{fallback}</>;
  }
  
  return (
    <Button
      {...buttonProps}
      onClick={onClick}
      disabled={disabled || loading}
      loading={loading}
    >
      {children}
    </Button>
  );
};

/**
 * AdminOnlyButton Component
 * 
 * Shortcut for buttons that should only be visible to admins
 */
export const AdminOnlyButton: React.FC<Omit<PermissionButtonProps, 'allowedRoles'>> = (props) => {
  return (
    <PermissionButton
      {...props}
      allowedRoles={['admin']}
    />
  );
};

/**
 * MemberOnlyButton Component
 * 
 * Shortcut for buttons that should only be visible to members
 */
export const MemberOnlyButton: React.FC<Omit<PermissionButtonProps, 'allowedRoles'>> = (props) => {
  return (
    <PermissionButton
      {...props}
      allowedRoles={['member']}
    />
  );
};
