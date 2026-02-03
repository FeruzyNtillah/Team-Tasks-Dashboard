/**
 * Type definitions for the Team Tasks Dashboard application
 * 
 * This file contains all the shared type definitions used throughout
 * the application to ensure type safety and consistency.
 */

// Re-export Supabase types for convenience
export type { User, Session } from '@supabase/supabase-js';

/**
 * Authentication related types
 */
export interface AuthResponse {
  error: string | null;
  success: boolean;
}

/**
 * User profile types
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'member';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Application user types (for dropdowns and assignments)
 * Note: This extends the Supabase User type with additional fields
 */
export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role?: 'admin' | 'member';
  avatar_url?: string;
}

/**
 * Project related types
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
  team_members?: string[];
}

/**
 * Task related types
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  attachment_url?: string;
}

/**
 * Navigation item types
 */
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

/**
 * Form validation types
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

/**
 * API response types
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination types
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Table column definition types
 */
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

/**
 * Theme and UI types
 */
export type Theme = 'light' | 'dark' | 'system';

export interface UIConfig {
  theme: Theme;
  sidebarCollapsed: boolean;
  notifications: boolean;
}

/**
 * Notification related types
 */
export interface Notification {
  id: string;
  type: 'project_created' | 'project_updated' | 'project_deleted' | 'task_created' | 'task_updated' | 'task_deleted' | 'task_assigned' | 'user_joined';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  metadata?: {
    projectId?: string;
    taskId?: string;
    projectName?: string;
    taskTitle?: string;
    userName?: string;
    [key: string]: any;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (notificationId: string) => void;
}
