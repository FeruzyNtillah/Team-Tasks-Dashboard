/**
 * API Service Layer
 * 
 * This file contains all API-related functions for communicating with
 * the Supabase backend. It provides a centralized location for all
 * database operations and API calls.
 */

import { supabase } from '../lib/supabase.client';
import type { Project, Task, UserProfile, ApiResponse } from '../types';

/**
 * Project API Services
 */

/**
 * Fetches all projects for the current user
 * @returns Promise<Project[]> - Array of projects
 */
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Fetches a single project by ID
 * @param projectId - The project ID to fetch
 * @returns Promise<Project> - The project data
 */
export const getProjectById = async (projectId: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Creates a new project
 * @param project - Project data to create
 * @returns Promise<Project> - The created project
 */
export const createProject = async (project: Partial<Project>): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates an existing project
 * @param projectId - The project ID to update
 * @param updates - Project data to update
 * @returns Promise<Project> - The updated project
 */
export const updateProject = async (
  projectId: string, 
  updates: Partial<Project>
): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Deletes a project
 * @param projectId - The project ID to delete
 * @returns Promise<void>
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
};

/**
 * Task API Services
 */

/**
 * Fetches all tasks, optionally filtered by project ID
 * @param projectId - Optional project ID to filter tasks
 * @returns Promise<Task[]> - Array of tasks
 */
export const getTasks = async (projectId?: string): Promise<Task[]> => {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

/**
 * Fetches a single task by ID
 * @param taskId - The task ID to fetch
 * @returns Promise<Task> - The task data
 */
export const getTaskById = async (taskId: string): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Creates a new task
 * @param task - Task data to create
 * @returns Promise<Task> - The created task
 */
export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates an existing task
 * @param taskId - The task ID to update
 * @param updates - Task data to update
 * @returns Promise<Task> - The updated task
 */
export const updateTask = async (
  taskId: string, 
  updates: Partial<Task>
): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Deletes a task
 * @param taskId - The task ID to delete
 * @returns Promise<void>
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
};

/**
 * User Profile API Services
 */

/**
 * Fetches the current user's profile
 * @returns Promise<UserProfile> - The user profile data
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No authenticated user found');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates the current user's profile
 * @param updates - Profile data to update
 * @returns Promise<UserProfile> - The updated profile
 */
export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No authenticated user found');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Utility functions
 */

/**
 * Handles API errors consistently
 * @param error - The error object from Supabase
 * @returns string - User-friendly error message
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (error?.error_description) {
    return error.error_description;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Generic API wrapper for consistent error handling
 * @param apiCall - The API function to call
 * @returns Promise<ApiResponse<T>> - Standardized API response
 */
export const apiWrapper = async <T>(
  apiCall: () => Promise<T>
): Promise<ApiResponse<T>> => {
  try {
    const data = await apiCall();
    return { data, error: undefined };
  } catch (error) {
    const errorMessage = handleApiError(error);
    return { error: errorMessage, data: undefined };
  }
};
