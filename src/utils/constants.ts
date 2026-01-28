/**
 * Application constants
 * 
 * This file contains all the constant values used throughout the application
 * to maintain consistency and make configuration easier.
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  NAME: 'Team Tasks Dashboard',
  VERSION: '1.0.0',
  DESCRIPTION: 'A modern task management application for team collaboration',
} as const;

/**
 * Navigation configuration
 */
export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: 'Home',
    path: '/',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'Folder',
    path: '/projects',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'CheckSquare',
    path: '/tasks',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    path: '/profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
  },
] as const;

/**
 * Task status options
 */
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: 'To Do',
  [TASK_STATUS.IN_PROGRESS]: 'In Progress',
  [TASK_STATUS.REVIEW]: 'Review',
  [TASK_STATUS.COMPLETED]: 'Completed',
} as const;

/**
 * Task priority options
 */
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: 'Low',
  [TASK_PRIORITY.MEDIUM]: 'Medium',
  [TASK_PRIORITY.HIGH]: 'High',
  [TASK_PRIORITY.URGENT]: 'Urgent',
} as const;

/**
 * Project status options
 */
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.ACTIVE]: 'Active',
  [PROJECT_STATUS.COMPLETED]: 'Completed',
  [PROJECT_STATUS.ARCHIVED]: 'Archived',
} as const;

/**
 * Color schemes for different statuses and priorities
 */
export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: 'bg-gray-100 text-gray-800',
  [TASK_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.REVIEW]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
} as const;

export const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: 'bg-gray-100 text-gray-800',
  [TASK_PRIORITY.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TASK_PRIORITY.HIGH]: 'bg-orange-100 text-orange-800',
  [TASK_PRIORITY.URGENT]: 'bg-red-100 text-red-800',
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PROJECTS: '/projects',
  TASKS: '/tasks',
  PROFILE: '/profile',
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PROJECT_NAME_MAX_LENGTH: 100,
  TASK_TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'team-tasks-theme',
  SIDEBAR_COLLAPSED: 'team-tasks-sidebar-collapsed',
  USER_PREFERENCES: 'team-tasks-user-preferences',
} as const;
