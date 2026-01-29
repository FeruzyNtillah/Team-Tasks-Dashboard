import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import type { Project } from '../types';

interface UseProjectsDataReturn {
  projects: Project[];
  users: Array<{ id: string; email: string; full_name: string }>;
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

/**
 * Hook to fetch projects and users data for dropdowns
 */
export const useProjectsData = (): UseProjectsDataReturn => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; email: string; full_name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch projects from database
   */
  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      return;
    }

    try {
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
    }
  }, [user]);

  /**
   * Fetch users from users table
   */
  const fetchUsers = useCallback(async () => {
    if (!user) {
      setUsers([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setUsers([]);
    }
  }, [user]);

  /**
   * Manual refresh functions
   */
  const refreshProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  /**
   * Initial data fetch
   */
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchProjects(), fetchUsers()]).finally(() => {
        setLoading(false);
      });
    } else {
      setProjects([]);
      setUsers([]);
      setLoading(false);
    }
  }, [user, fetchProjects, fetchUsers]);

  return {
    projects,
    users,
    loading,
    error,
    refreshProjects,
    refreshUsers,
  };
};
