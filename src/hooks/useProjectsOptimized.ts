import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import type { Project } from '../types';

interface UseProjectsOptimizedReturn {
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
 * Optimized Projects Hook with Caching and Batched Fetching
 * 
 * Performance improvements:
 * - Single query for user role and projects
 * - Response caching
 * - Optimistic updates
 * - Reduced re-renders
 */
export const useProjectsOptimized = (): UseProjectsOptimizedReturn => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);
  
  // Cache for user data to avoid repeated fetches
  const [userCache, setUserCache] = useState<{
    role: 'admin' | 'member';
    timestamp: number;
  } | null>(null);

  /**
   * Fetch user role and projects in parallel with caching
   */
  const fetchUserData = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setUserRole(null);
      setLoading(false);
      return;
    }

    // Check cache first (5-minute cache)
    const now = Date.now();
    if (userCache && (now - userCache.timestamp) < 300000) {
      setUserRole(userCache.role);
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user role and projects in parallel
      const [userResponse, projectsResponse] = await Promise.all([
        // Only fetch user role if not cached
        userCache 
          ? Promise.resolve({ data: { role: userCache.role }, error: null })
          : supabase
              .from('users')
              .select('role')
              .eq('id', user.id)
              .single(),
        
        // Fetch projects with optimized query
        supabase
          .from('projects')
          .select('id, name, description, status, created_by, created_at, updated_at, team_members')
          .order('created_at', { ascending: false })
      ]);

      // Handle user role response
      if (!userCache && userResponse.error) {
        if (userResponse.error.code === 'PGRST116') {
          // Create user profile if not exists
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email || 'User',
              role: 'admin'
            })
            .select('role')
            .single();
          
          if (!createError && newUser) {
            setUserRole(newUser.role as 'admin' | 'member');
            setUserCache({ role: newUser.role, timestamp: now });
          }
        }
      } else if (!userCache && userResponse.data) {
        const role = userResponse.data.role as 'admin' | 'member';
        setUserRole(role);
        setUserCache({ role, timestamp: now });
      }

      // Handle projects response
      if (projectsResponse.error) {
        throw projectsResponse.error;
      }
      
      setProjects(projectsResponse.data || []);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [user, userCache]);

  /**
   * Optimistic update for better perceived performance
   */
  const createProject = useCallback(async (
    projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Project> => {
    if (!user || userRole !== 'admin') {
      throw new Error('Insufficient permissions');
    }

    // Optimistic update
    const optimisticProject: Project = {
      ...projectData,
      id: `temp-${Date.now()}`,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects(prev => [optimisticProject, ...prev]);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status,
          created_by: user.id,
          team_members: projectData.team_members || []
        })
        .select()
        .single();

      if (error) throw error;
      
      // Replace optimistic update with real data
      setProjects(prev => 
        prev.map(p => p.id === optimisticProject.id ? data : p)
      );
      
      return data;
    } catch (err) {
      // Rollback optimistic update
      setProjects(prev => prev.filter(p => p.id !== optimisticProject.id));
      throw err;
    }
  }, [user, userRole]);

  // Permission checks
  const canCreateProject = userRole === 'admin';
  const canEditProject = useCallback(() => userRole === 'admin', [userRole]);
  const canDeleteProject = useCallback(() => userRole === 'admin', [userRole]);

  // Setup realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('projects_changes_optimized')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
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

  // Initial fetch
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    projects,
    loading,
    error,
    userRole,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    refreshProjects: fetchUserData,
    createProject,
    updateProject: async (projectId: string, updates: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    deleteProject: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
  };
};
