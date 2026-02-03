import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
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
  const { addNotification } = useNotifications();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);

  /**
   * Fetch user role from users table
   */
  const fetchUserRole = useCallback(async () => {
    if (!user) {
      setUserRole(null);
      return;
    }

    try {
      console.log('Fetching user role for:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If user not found, create one with admin role
        if (error.code === 'PGRST116') {
          console.log('User profile not found, creating one...');
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email || 'User',
              role: 'admin' // First user gets admin
            })
            .select('role')
            .single();
          
          if (createError) {
            console.error('Error creating user profile:', createError);
            console.error('Create error details:', {
              code: createError.code,
              message: createError.message,
              details: createError.details,
              hint: createError.hint
            });
            setError(`Failed to set up user profile: ${createError.message}`);
          } else if (newUser) {
            console.log('User profile created successfully with role:', newUser.role);
            setUserRole(newUser.role as 'admin' | 'member');
          }
        } else {
          setError(`Failed to fetch user permissions: ${error.message} (Code: ${error.code})`);
        }
      } else if (data) {
        console.log('User role fetched successfully:', data.role);
        setUserRole(data.role as 'admin' | 'member');
      } else {
        console.warn('No data returned from users query');
        setError('No user profile found');
      }
    } catch (err) {
      console.error('Unexpected error fetching user role:', err);
      setError(`Failed to fetch user permissions: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

      console.log('Fetching projects...');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      console.log('Projects fetched successfully:', data?.length || 0, 'projects');
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
    console.log('=== CREATE PROJECT DEBUG ===');
    console.log('1. Project data received:', projectData);
    console.log('2. User role:', userRole);
    console.log('3. Can create project:', userRole === 'admin');
    console.log('4. User authenticated:', !!user);
    console.log('5. User ID:', user?.id);

    if (!user) {
      const errorMsg = 'User not authenticated';
      console.error('ERROR:', errorMsg);
      throw new Error(errorMsg);
    }

    if (userRole !== 'admin') {
      const errorMsg = `Insufficient permissions to create projects. Current role: ${userRole}`;
      console.error('ERROR:', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const projectToCreate = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        created_by: user.id,
        team_members: projectData.team_members || []
      };

      console.log('6. Final project data to insert:', projectToCreate);
      console.log('7. Making Supabase insert call...');

      const { data, error } = await supabase
        .from('projects')
        .insert(projectToCreate)
        .select()
        .single();

      if (error) {
        console.error('8. Supabase insert error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message} (${error.code})`);
      }

      if (!data) {
        console.error('9. No data returned from insert');
        throw new Error('No data returned from database after insert');
      }

      console.log('10. Project created successfully:', data);
      
      // Add notification for project creation
      addNotification({
        type: 'project_created',
        title: 'New Project Created',
        message: `Project "${projectToCreate.name}" has been created successfully`,
        metadata: {
          projectId: data.id,
          projectName: projectToCreate.name
        }
      });
      
      return data;
    } catch (err) {
      console.error('11. Error creating project:', err);
      
      if (err instanceof Error) {
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        throw err;
      }
      
      throw new Error(`Failed to create project: ${String(err)}`);
    }
  }, [userRole, user, addNotification]);

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
      
      // Add notification for project update
      addNotification({
        type: 'project_updated',
        title: 'Project Updated',
        message: `Project "${data.name}" has been updated`,
        metadata: {
          projectId: data.id,
          projectName: data.name
        }
      });
      
      return data;
    } catch (err) {
      console.error('Error updating project:', err);
      throw new Error('Failed to update project');
    }
  }, [canEditProject, addNotification]);

  /**
   * Delete project (admin only)
   */
  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    if (!canDeleteProject()) {
      throw new Error('Insufficient permissions to delete this project');
    }

    try {
      // Get project name before deletion for notification
      const projectToDelete = projects.find(p => p.id === projectId);
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        throw new Error(`Database error: ${error.message} (${error.code})`);
      }
      
      // Add notification for project deletion
      if (projectToDelete) {
        addNotification({
          type: 'project_deleted',
          title: 'Project Deleted',
          message: `Project "${projectToDelete.name}" has been deleted`,
          metadata: {
            projectId: projectToDelete.id,
            projectName: projectToDelete.name
          }
        });
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to delete project');
    }
  }, [canDeleteProject, projects, addNotification]);

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

    console.log('Setting up realtime subscription for projects...');
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
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [user]);

  /**
   * Initial data fetch and role setup
   */
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching role and projects...');
      fetchUserRole();
      fetchProjects();
    } else {
      console.log('No user, clearing data...');
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
