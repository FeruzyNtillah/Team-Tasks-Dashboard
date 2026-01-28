/**
 * Utility helper functions
 * 
 * This file contains common utility functions used throughout the application
 * to handle common operations like date formatting, validation, etc.
 */

import type { Task, Project } from '../types';

/**
 * Date formatting utilities
 */

/**
 * Formats a date string to a display format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date string to a datetime format
 * @param dateString - ISO date string
 * @returns Formatted datetime string
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Gets relative time string (e.g., "2 hours ago", "3 days ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString);
};

/**
 * Validation utilities
 */

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password - Password string to validate
 * @returns True if password meets requirements
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
};

/**
 * String utilities
 */

/**
 * Truncates text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Converts string to title case
 * @param text - Text to convert
 * @returns Title case string
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Array utilities
 */

/**
 * Sorts tasks by priority and due date
 * @param tasks - Array of tasks
 * @returns Sorted array of tasks
 */
export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  
  return tasks.sort((a, b) => {
    // First sort by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by due date (earliest first)
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    
    return 0;
  });
};

/**
 * Filters tasks by status
 * @param tasks - Array of tasks
 * @param status - Status to filter by
 * @returns Filtered array of tasks
 */
export const filterTasksByStatus = (tasks: Task[], status: Task['status']): Task[] => {
  return tasks.filter(task => task.status === status);
};

/**
 * Project utilities
 */

/**
 * Calculates project completion percentage
 * @param project - Project object
 * @param tasks - Array of tasks in the project
 * @returns Completion percentage (0-100)
 */
export const getProjectCompletion = (project: Project, tasks: Task[]): number => {
  const projectTasks = tasks.filter(task => task.project_id === project.id);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  return Math.round((completedTasks.length / projectTasks.length) * 100);
};

/**
 * Color utilities
 */

/**
 * Generates a color based on string hash
 * @param str - String to generate color from
 * @returns Hex color code
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Storage utilities
 */

/**
 * Gets item from localStorage with error handling
 * @param key - Storage key
 * @returns Parsed JSON value or null
 */
export const getStorageItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

/**
 * Sets item in localStorage with error handling
 * @param key - Storage key
 * @param value - Value to store
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent fail for storage errors
  }
};

/**
 * Removes item from localStorage
 * @param key - Storage key
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silent fail for storage errors
  }
};
