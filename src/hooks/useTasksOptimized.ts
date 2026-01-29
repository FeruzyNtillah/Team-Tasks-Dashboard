import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import type { Task } from '../types';

interface UseTasksOptimizedReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  userRole: 'admin' | 'member' | null;
  userId: string | null;
  canCreateTask: boolean;
  canEditTask: (task: Task) => boolean;
  canDeleteTask: () => boolean;
  refreshTasks: (projectId?: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
}

/**
 * Optimized Tasks Hook with Caching and Performance Improvements
 */
export const useTasksOptimized = (): UseTasksOptimizedReturn => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null);
  
  // Cache for user data to avoid repeated fetches
  const [userCache, setUserCache] = useState<{
    role: 'admin' | 'member';
    timestamp: number;
  } | null>(null);

  // Cache for tasks data
  const [tasksCache, setTasksCache] = useState<{
    data: Task[];
    timestamp: number;
  } | null>(null);

  /**
   * Fetch user role and tasks with caching
   */
  const fetchTasksData = useCallback(async (projectId?: string) => {
    if (!user) {
      setTasks([]);
      setUserRole(null);
      setLoading(false);
      return;
    }

    // Check cache first (5-minute cache)
    const now = Date.now();
    
    if (userCache && (now - userCache.timestamp) < 300000) {
      setUserRole(userCache.role);
    }

    if (tasksCache && (now - tasksCache.timestamp) < 300000 && !projectId) {
      setTasks(tasksCache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch tasks with optimized query
      let tasksQuery = supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          assigned_to,
          project_id,
          created_by,
          created_at,
          updated_at,
          due_date
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        tasksQuery = tasksQuery.eq('project_id', projectId);
      }

      const { data: tasksData, error: tasksError } = await tasksQuery;

      if (tasksError) {
        throw tasksError;
      }
      
      // Fetch user role if not cached
      if (!userCache) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError) {
          if (userError.code === 'PGRST116') {
            // Create user profile if not exists
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.email || 'User',
                role: 'member'
              })
              .select('role')
              .single();
            
            if (!createError && newUser) {
              setUserRole(newUser.role as 'admin' | 'member');
              setUserCache({ role: newUser.role, timestamp: now });
            }
          }
        } else if (userData) {
          const role = userData.role as 'admin' | 'member';
          setUserRole(role);
          setUserCache({ role, timestamp: now });
        }
      }

      // Set tasks data
      const tasks = tasksData || [];
      setTasks(tasks);
      
      if (!projectId) {
        setTasksCache({ data: tasks, timestamp: now });
      }
    } catch (err) {
      console.error('Error fetching tasks data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user, userCache, tasksCache]);

  /**
   * Optimistic update for creating tasks
   */
  const createTask = useCallback(async (
    taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Task> => {
    if (!user || userRole !== 'admin') {
      throw new Error('Only admins can create tasks');
    }

    // Optimistic update
    const optimisticTask: Task = {
      ...taskData,
      id: `temp-${Date.now()}`,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks(prev => [optimisticTask, ...prev]);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          assigned_to: taskData.assigned_to || null,
          project_id: taskData.project_id,
          due_date: taskData.due_date || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Replace optimistic update with real data
      setTasks(prev => 
        prev.map(t => t.id === optimisticTask.id ? data : t)
      );
      
      // Invalidate cache
      setTasksCache(null);
      
      return data;
    } catch (err) {
      // Rollback optimistic update
      setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      throw err;
    }
  }, [user, userRole]);

  /**
   * Optimistic update for updating tasks
   */
  const updateTask = useCallback(async (
    taskId: string, 
    updates: Partial<Task>
  ): Promise<Task> => {
    // Check permissions
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) {
      throw new Error('Task not found');
    }

    const canEdit = userRole === 'admin' || 
      (userRole === 'member' && taskToUpdate.assigned_to === user?.id);
    
    if (!canEdit) {
      throw new Error('Insufficient permissions to update this task');
    }

    // Store original state for rollback
    const originalTask = { ...taskToUpdate };

    // Optimistic update
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      )
    );

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
      // Update with real data
      setTasks(prev => 
        prev.map(task => task.id === taskId ? data : task)
      );
      
      // Invalidate cache
      setTasksCache(null);
      
      return data;
    } catch (err) {
      // Rollback optimistic update
      setTasks(prev => 
        prev.map(task => task.id === taskId ? originalTask : task)
      );
      throw err;
    }
  }, [tasks, userRole, user]);

  /**
   * Optimistic update for deleting tasks
   */
  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    if (userRole !== 'admin') {
      throw new Error('Only admins can delete tasks');
    }

    // Store original task for rollback
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) {
      throw new Error('Task not found');
    }

    // Optimistic update
    setTasks(prev => prev.filter(task => task.id !== taskId));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      // Invalidate cache
      setTasksCache(null);
    } catch (err) {
      // Rollback optimistic update
      setTasks(prev => [...prev, taskToDelete]);
      throw err;
    }
  }, [tasks, userRole]);

  // Permission checks
  const canCreateTask = userRole === 'admin';
  const canDeleteTask = () => userRole === 'admin';
  const canEditTask = useCallback((task: Task) => {
    if (userRole === 'admin') return true;
    if (userRole === 'member' && task.assigned_to === user?.id) return true;
    return false;
  }, [userRole, user]);

  // Helper function to get tasks by project
  const getTasksByProject = useCallback((projectId: string) => {
    return tasks.filter(task => task.project_id === projectId);
  }, [tasks]);

  // Setup realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tasks_changes_optimized')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setTasks(prev => [payload.new as Task, ...prev]);
              setTasksCache(null); // Invalidate cache
              break;
            case 'UPDATE':
              setTasks(prev => 
                prev.map(task => 
                  task.id === payload.new.id ? payload.new as Task : task
                )
              );
              setTasksCache(null); // Invalidate cache
              break;
            case 'DELETE':
              setTasks(prev => 
                prev.filter(task => task.id !== payload.old.id)
              );
              setTasksCache(null); // Invalidate cache
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
    fetchTasksData();
  }, [fetchTasksData]);

  return {
    tasks,
    loading,
    error,
    userRole,
    userId: user?.id || null,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    refreshTasks: fetchTasksData,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
  };
};
