import type { Project, Task } from '../types';

/**
 * Permission utilities for role-based access control
 * 
 * These functions provide centralized permission checking logic
 * that can be used throughout the application to enforce
 * role-based security rules.
 */

export type Role = 'admin' | 'member';

/**
 * Check if a user has admin role
 */
export const isAdmin = (userRole: Role | null): boolean => {
  return userRole === 'admin';
};

/**
 * Check if a user has member role
 */
export const isMember = (userRole: Role | null): boolean => {
  return userRole === 'member';
};

/**
 * Project permissions
 */

/**
 * Check if user can create projects
 */
export const canCreateProject = (userRole: Role | null): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can view a specific project
 */
export const canViewProject = (userRole: Role | null): boolean => {
  return userRole !== null; // All authenticated users can view projects
};

/**
 * Check if user can edit a specific project
 */
export const canEditProject = (userRole: Role | null): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can delete a specific project
 */
export const canDeleteProject = (userRole: Role | null): boolean => {
  return isAdmin(userRole);
};

/**
 * Task permissions
 */

/**
 * Check if user can create tasks
 */
export const canCreateTask = (userRole: Role | null): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can view tasks
 */
export const canViewTasks = (userRole: Role | null): boolean => {
  return userRole !== null; // All authenticated users can view tasks
};

/**
 * Check if user can edit a specific task
 */
export const canEditTask = (userRole: Role | null, task: Task, userId?: string): boolean => {
  if (isAdmin(userRole)) return true;
  if (isMember(userRole) && userId && task.assigned_to === userId) return true;
  return false;
};

/**
 * Check if user can delete a specific task
 */
export const canDeleteTask = (userRole: Role | null): boolean => {
  return isAdmin(userRole); // Only admins can delete tasks
};

/**
 * Check if user can assign tasks to others
 */
export const canAssignTasks = (userRole: Role | null): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can change task status
 */
export const canChangeTaskStatus = (userRole: Role | null, task: Task, userId?: string): boolean => {
  return canEditTask(userRole, task, userId);
};

/**
 * Filter tasks based on user permissions
 */
export const filterTasksByPermission = (
  tasks: Task[], 
  userRole: Role | null
): Task[] => {
  if (!userRole) return [];
  
  return tasks.filter(() => {
    // All users can view tasks
    return true;
  });
};

/**
 * Filter projects based on user permissions
 */
export const filterProjectsByPermission = (
  projects: Project[], 
  userRole: Role | null
): Project[] => {
  if (!userRole) return [];
  
  return projects.filter(() => {
    // All authenticated users can view projects
    return true;
  });
};

/**
 * Get available actions for a project based on user role
 */
export const getProjectActions = (userRole: Role | null) => {
  return {
    canView: canViewProject(userRole),
    canEdit: canEditProject(userRole),
    canDelete: canDeleteProject(userRole),
  };
};

/**
 * Get available actions for a task based on user role
 */
export const getTaskActions = (userRole: Role | null, task: Task, userId?: string) => {
  return {
    canView: canViewTasks(userRole),
    canEdit: canEditTask(userRole, task, userId),
    canDelete: canDeleteTask(userRole),
    canChangeStatus: canChangeTaskStatus(userRole, task, userId),
  };
};

/**
 * Permission check result with error message
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Check project access with detailed error message
 */
export const checkProjectAccess = (
  action: 'create' | 'view' | 'edit' | 'delete',
  userRole: Role | null,
  project?: Project
): PermissionCheck => {
  switch (action) {
    case 'create':
      return {
        allowed: canCreateProject(userRole),
        reason: !canCreateProject(userRole) ? 'Only admins can create projects' : undefined
      };
    
    case 'view':
      return {
        allowed: canViewProject(userRole),
        reason: !canViewProject(userRole) ? 'You must be logged in to view projects' : undefined
      };
    
    case 'edit':
      if (!project) return { allowed: false, reason: 'Project not found' };
      return {
        allowed: canEditProject(userRole),
        reason: !canEditProject(userRole) ? 'Only admins can edit projects' : undefined
      };
    
    case 'delete':
      if (!project) return { allowed: false, reason: 'Project not found' };
      return {
        allowed: canDeleteProject(userRole),
        reason: !canDeleteProject(userRole) ? 'Only admins can delete projects' : undefined
      };
    
    default:
      return { allowed: false, reason: 'Unknown action' };
  }
};

/**
 * Check task access with detailed error message
 */
export const checkTaskAccess = (
  action: 'create' | 'view' | 'edit' | 'delete' | 'assign',
  userRole: Role | null,
  task?: Task,
  userId?: string
): PermissionCheck => {
  switch (action) {
    case 'create':
      return {
        allowed: canCreateTask(userRole),
        reason: !canCreateTask(userRole) ? 'Only admins can create tasks' : undefined
      };
    
    case 'view':
      return {
        allowed: canViewTasks(userRole),
        reason: !canViewTasks(userRole) ? 'You must be logged in to view tasks' : undefined
      };
    
    case 'edit':
      if (!task) return { allowed: false, reason: 'Task not found' };
      return {
        allowed: canEditTask(userRole, task, userId),
        reason: !canEditTask(userRole, task, userId) 
          ? (isAdmin(userRole) ? 'Unknown error' : 'You can only edit tasks assigned to you')
          : undefined
      };
    
    case 'delete':
      if (!task) return { allowed: false, reason: 'Task not found' };
      return {
        allowed: canDeleteTask(userRole),
        reason: !canDeleteTask(userRole) ? 'Only admins can delete tasks' : undefined
      };
    
    case 'assign':
      return {
        allowed: canAssignTasks(userRole),
        reason: !canAssignTasks(userRole) ? 'Only admins can assign tasks' : undefined
      };
    
    default:
      return { allowed: false, reason: 'Unknown action' };
  }
};
