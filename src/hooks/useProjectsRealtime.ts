import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import type { Project } from '../types';

interface UseProjectsRealtimeReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  userRole: 'admin' | 'member' | null;
  canCreateProject: boolean;
  canEditProject: () => boolean;
  canDeleteProject: () => boolean;
  refreshProjects: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
}

/**
 * Realtime Projects Hook with Role-Based Permissions
 * 
 * This hook provides:
 * - Real-time project updates using Supabase subscriptions
 * - Role-based permission checks (admin vs member)
 * - CRUD operations with proper authorization
 * - Automatic data synchronization across clients
 * 
 * Permission Rules:
 * - Admin: Can create, view, update, delete all projects
 * - Member: Can only view projects, no CRUD operations
 */
export const useProjectsRealtime = (): UseProjectsRealtimeReturn => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);

  /**
   * Fetch user role from profiles table
   */
  const fetchUserRole = useCallback(async () => {
    if (!user) {
      setUserRole(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        // If user profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating one...');
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || 'User',
              role: 'admin' // Make first user admin - change this logic as needed
            })
            .select('role')
            .single();
          
          if (createError) {
            console.error('Error creating user profile:', createError);
            setError('Failed to set up user profile');
          } else if (newProfile) {
            setUserRole(newProfile.role as 'admin' | 'member');
          }
        } else {
          setError('Failed to fetch user permissions');
        }
      } else {
        setUserRole(data.role as 'admin' | 'member');
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
      setError('Failed to fetch user permissions');
    }
  }, [user]);

  /**
   * Fetch projects from database
   */
  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Permission checks
   */
  const canCreateProject = userRole === 'admin';

  const canEditProject = useCallback((): boolean => {
    return userRole === 'admin';
  }, [userRole]);

  const canDeleteProject = useCallback((): boolean => {
    return userRole === 'admin';
  }, [userRole]);

  /**
   * Create new project (admin only)
   */
  const createProject = useCallback(async (
    projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Project> => {
    if (!canCreateProject) {
      throw new Error('Insufficient permissions to create projects');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const projectToCreate = {
        ...projectData,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectToCreate)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating project:', err);
      throw new Error('Failed to create project');
    }
  }, [canCreateProject, user]);

  /**
   * Update project (admin only)
   */
  const updateProject = useCallback(async (
    projectId: string,
    updates: Partial<Project>
  ): Promise<Project> => {
    if (!canEditProject()) {
      throw new Error('Insufficient permissions to update this project');
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating project:', err);
      throw new Error('Failed to update project');
    }
  }, [canEditProject]);

  /**
   * Delete project (admin only)
   */
  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    if (!canDeleteProject()) {
      throw new Error('Insufficient permissions to delete this project');
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting project:', err);
      throw new Error('Failed to delete project');
    }
  }, [canDeleteProject]);

  /**
   * Manual refresh function
   */
  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  /**
   * Setup realtime subscription
   */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('Projects realtime change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setProjects(prev => [payload.new as Project, ...prev]);
              break;
            case 'UPDATE':
              setProjects(prev => 
                prev.map(project => 
                  project.id === payload.new.id ? payload.new as Project : project
                )
              );
              break;
            case 'DELETE':
              setProjects(prev => 
                prev.filter(project => project.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  /**
   * Initial data fetch and role setup
   */
  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchProjects();
    } else {
      setProjects([]);
      setUserRole(null);
      setLoading(false);
    }
  }, [user, fetchUserRole, fetchProjects]);

  return {
    projects,
    loading,
    error,
    userRole,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
