import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.client';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import type { Task } from '../types';

interface UseTasksRealtimeReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  userRole: 'admin' | 'member' | null;
  userId: string | null;
  canCreateTask: boolean;
  canEditTask: (task: Task) => boolean;
  canDeleteTask: () => boolean;
  canUploadAttachment: (task: Task) => boolean;
  refreshTasks: (projectId?: string) => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  getTasksByProject: (projectId: string) => Task[];
}

/**
 * Realtime Tasks Hook with Role-Based Permissions
 * 
 * This hook provides:
 * - Real-time task updates using Supabase subscriptions
 * - Role-based permission checks (admin vs member)
 * - CRUD operations with proper authorization
 * - Automatic data synchronization across clients
 * 
 * Permission Rules:
 * - Admin: Can create, view, update, delete all tasks (no attachment upload)
 * - Member: Can view all tasks, update status and upload PDF attachments for assigned tasks
 */
export const useTasksRealtime = (): UseTasksRealtimeReturn => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);
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
   * Fetch tasks from database
   */
  const fetchTasks = useCallback(async (projectId?: string) => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Permission checks
   */
  const canCreateTask = userRole === 'admin';

  const canEditTask = useCallback((task: Task): boolean => {
    if (userRole === 'admin') return true;
    // Members can only edit status and attachment of their assigned tasks
    if (userRole === 'member') return task.assigned_to === user?.id;
    return false;
  }, [userRole, user]);

  const canDeleteTask = useCallback((): boolean => {
    return userRole === 'admin'; // Only admins can delete tasks
  }, [userRole]);

  /**
   * Check if user can upload attachment for a task
   * - Admins: No (they create tasks, don't submit reports)
   * - Members: Yes, but only for tasks assigned to them
   */
  const canUploadAttachment = useCallback((task: Task): boolean => {
    // Admins don't upload attachments
    if (userRole === 'admin') return false;
    // Members can upload only for tasks assigned to them
    if (userRole === 'member') return task.assigned_to === user?.id;
    return false;
  }, [userRole, user]);

  /**
   * Create new task (admin only)
   * Note: Admins don't set attachment_url when creating tasks
   */
  const createTask = useCallback(async (
    taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Task> => {
    if (!canCreateTask) {
      throw new Error('Insufficient permissions to create tasks');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const taskToCreate = {
        ...taskData,
        created_by: user.id,
        // Ensure admin doesn't set attachment_url
        attachment_url: undefined,
        submission_status: 'pending',
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskToCreate)
        .select()
        .single();

      if (error) throw error;
      
      // Add notification for task creation
      addNotification({
        type: 'task_created',
        title: 'New Task Created',
        message: `Task "${data.title}" has been created`,
        metadata: {
          taskId: data.id,
          taskTitle: data.title,
          projectId: data.project_id
        }
      });
      
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw new Error('Failed to create task');
    }
  }, [canCreateTask, user, addNotification]);

  /**
   * Update task
   * - Admin: Can update any field except attachment_url
   * - Member: Can only update status and attachment_url for assigned tasks
   */
  const updateTask = useCallback(async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<Task> => {
    // Check if user has permission to update this task
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask || !canEditTask(currentTask)) {
      throw new Error('Insufficient permissions to update this task');
    }

    try {
      let allowedUpdates: Partial<Task> = {};

      if (userRole === 'admin') {
        // Admin can update everything except attachment_url
        const adminUpdates = { ...updates };
        delete adminUpdates.attachment_url;
        allowedUpdates = adminUpdates;
      } else if (userRole === 'member') {
        // Members can only update status and attachment_url
        if (updates.status) allowedUpdates.status = updates.status;
        if (updates.attachment_url !== undefined) allowedUpdates.attachment_url = updates.attachment_url;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({ ...allowedUpdates, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
      // Add notification for task update
      addNotification({
        type: 'task_updated',
        title: 'Task Updated',
        message: `Task "${data.title}" has been updated`,
        metadata: {
          taskId: data.id,
          taskTitle: data.title,
          projectId: data.project_id
        }
      });
      
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      throw new Error('Failed to update task');
    }
  }, [tasks, canEditTask, userRole, addNotification]);

  /**
   * Delete task (admin only)
   */
  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    // Check if user has permission to delete this task
    if (!canDeleteTask()) {
      throw new Error('Insufficient permissions to delete this task');
    }

    try {
      // Get task details before deletion for notification
      const taskToDelete = tasks.find(t => t.id === taskId);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      // Add notification for task deletion
      if (taskToDelete) {
        addNotification({
          type: 'task_deleted',
          title: 'Task Deleted',
          message: `Task "${taskToDelete.title}" has been deleted`,
          metadata: {
            taskId: taskToDelete.id,
            taskTitle: taskToDelete.title,
            projectId: taskToDelete.project_id
          }
        });
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      throw new Error('Failed to delete task');
    }
  }, [tasks, canDeleteTask, addNotification]);

  /**
   * Manual refresh function
   */
  const refreshTasks = useCallback(async (projectId?: string) => {
    await fetchTasks(projectId);
  }, [fetchTasks]);

  /**
   * Get tasks filtered by project
   */
  const getTasksByProject = useCallback((projectId: string): Task[] => {
    return tasks.filter(task => task.project_id === projectId);
  }, [tasks]);

  /**
   * Setup realtime subscription
   */
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          console.log('Tasks realtime change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setTasks(prev => [payload.new as Task, ...prev]);
              break;
            case 'UPDATE':
              setTasks(prev => 
                prev.map(task => 
                  task.id === payload.new.id ? payload.new as Task : task
                )
              );
              break;
            case 'DELETE':
              setTasks(prev => 
                prev.filter(task => task.id !== payload.old.id)
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
      fetchTasks();
    } else {
      setTasks([]);
      setUserRole(null);
      setLoading(false);
    }
  }, [user, fetchUserRole, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    userRole,
    userId: user?.id || null,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canUploadAttachment,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
  };
};