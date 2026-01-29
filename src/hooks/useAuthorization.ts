import { useUserProfile } from './useUserProfile';
import { useAuth } from '../contexts/AuthContext';
import {
  canCreateProject,
  canViewProject,
  canEditProject,
  canDeleteProject,
  canCreateTask,
  canViewTasks,
  canEditTask,
  canDeleteTask,
  canAssignTasks,
  canChangeTaskStatus,
  checkProjectAccess,
  checkTaskAccess,
  type Role
} from '../utils/permissions';
import type { Project, Task } from '../types';

/**
 * Authorization Hook
 * 
 * This hook provides a comprehensive authorization system that combines
 * user profile data with permission utilities to enforce role-based
 * access control throughout the application.
 * 
 * Features:
 * - User role and profile information
 * - Project-specific permission checks
 * - Task-specific permission checks
 * - Detailed permission check results with error messages
 * - Loading states for profile fetching
 * 
 * Usage:
 * ```tsx
 * const {
 *   user,
 *   profile,
 *   userRole,
 *   loading,
 *   canCreateProject,
 *   canEditProject,
 *   canDeleteProject,
 *   canCreateTask,
 *   canEditTask,
 *   canDeleteTask,
 *   checkProjectAccess,
 *   checkTaskAccess
 * } = useAuthorization();
 * 
 * // Check specific project permissions
 * const canEditThisProject = checkProjectAccess('edit', userRole, project);
 * 
 * // Check specific task permissions
 * const canEditThisTask = checkTaskAccess('edit', userRole, task, user?.id);
 * ```
 */
export const useAuthorization = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const userRole = profile?.role as Role | null;

  // Basic permission checks based on user role
  const projectPermissions = {
    canCreate: canCreateProject(userRole),
    canView: canViewProject(userRole),
    canEdit: canEditProject(userRole),
    canDelete: canDeleteProject(userRole)
  };

  const taskPermissions = {
    canCreate: canCreateTask(userRole),
    canView: canViewTasks(userRole),
    canDelete: canDeleteTask(userRole),
    canAssign: canAssignTasks(userRole)
  };

  // Task-specific permission checks that require task data
  const getTaskPermissions = (task: Task) => ({
    canEdit: canEditTask(userRole, task, user?.id),
    canChangeStatus: canChangeTaskStatus(userRole, task, user?.id)
  });

  // Project-specific permission checks with detailed results
  const checkProjectAccessWithDetails = (
    action: 'create' | 'view' | 'edit' | 'delete',
    project?: Project
  ) => {
    return checkProjectAccess(action, userRole, project);
  };

  // Task-specific permission checks with detailed results
  const checkTaskAccessWithDetails = (
    action: 'create' | 'view' | 'edit' | 'delete' | 'assign',
    task?: Task
  ) => {
    return checkTaskAccess(action, userRole, task, user?.id);
  };

  // Helper to check if user is admin
  const isAdmin = userRole === 'admin';

  // Helper to check if user is member
  const isMember = userRole === 'member';

  // Helper to check if user is authenticated
  const isAuthenticated = !!user && !profileLoading;

  return {
    // User information
    user,
    profile,
    userRole,
    userId: user?.id,
    
    // Loading states
    loading: profileLoading,
    error: profileError,
    isAuthenticated,
    
    // Role helpers
    isAdmin,
    isMember,
    
    // Project permissions (with explicit names for clarity)
    canCreateProject: projectPermissions.canCreate,
    canViewProject: projectPermissions.canView,
    canEditProject: projectPermissions.canEdit,
    canDeleteProject: projectPermissions.canDelete,
    
    // Task permissions (with explicit names for clarity)
    canCreateTask: taskPermissions.canCreate,
    canViewTasks: taskPermissions.canView,
    canDeleteTask: taskPermissions.canDelete,
    canAssignTasks: taskPermissions.canAssign,
    canEditTask: (task: Task, userId?: string) => canEditTask(userRole, task, userId),
    
    // Dynamic permission checks
    getTaskPermissions,
    checkProjectAccess: checkProjectAccessWithDetails,
    checkTaskAccess: checkTaskAccessWithDetails
  };
};
