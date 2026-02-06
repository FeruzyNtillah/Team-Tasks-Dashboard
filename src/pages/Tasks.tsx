import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Calendar, User, Edit2, Trash2, AlertCircle, Paperclip, CheckSquare } from 'lucide-react';
import { useTasksRealtime } from '../hooks/useTasksRealtime';
import { useProjectsData } from '../hooks/useProjectsData';
import { fileUploadService } from '../services/fileUpload';
import type { Task } from '../types';

const Tasks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to: string;
    project_id: string;
    due_date?: string;
    attachment_url?: string;
  }>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigned_to: '',
    project_id: '',
    due_date: '',
    attachment_url: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    userId,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    createTask,
    updateTask,
    deleteTask
  } = useTasksRealtime();

  const {
    projects,
    users,
    loading: dataLoading,
    error: dataError
  } = useProjectsData();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-200 text-red-900';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Helper function to get user name by ID
   * Returns full_name if available, falls back to email, or shows "Unknown User"
   */
  const getUserName = (userId: string | undefined): string => {
    if (!userId) return 'Unassigned';
    const user = users.find(u => u.id === userId);
    return user?.full_name || user?.email || 'Unknown User';
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to || '',
        project_id: task.project_id,
        due_date: task.due_date || '',
        attachment_url: task.attachment_url || ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assigned_to: '',
        project_id: '',
        due_date: ''
      });
    }
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setError(null);
    setSelectedFile(null);
    setUploadingFile(false);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assigned_to: '',
      project_id: '',
      due_date: '',
      attachment_url: ''
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        fileUploadService.validateFile(file);
        setSelectedFile(file);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid file');
        setSelectedFile(null);
      }
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.project_id) {
      setError('Title and Project are required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let attachmentUrl = formData.attachment_url;
      
      // Upload new file if selected
      if (selectedFile && userId) {
        setUploadingFile(true);
        try {
          const uploadResult = await fileUploadService.uploadFile(selectedFile, userId);
          attachmentUrl = uploadResult.url;
        } catch (uploadErr) {
          throw new Error(uploadErr instanceof Error ? uploadErr.message : 'File upload failed');
        } finally {
          setUploadingFile(false);
        }
      }

      if (editingTask) {
        await updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assigned_to: formData.assigned_to || undefined,
          project_id: formData.project_id,
          due_date: formData.due_date || undefined,
          attachment_url: attachmentUrl
        });
      } else {
        await createTask({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assigned_to: formData.assigned_to || undefined,
          project_id: formData.project_id,
          created_by: '', // Will be set by the hook
          due_date: formData.due_date || undefined,
          attachment_url: attachmentUrl
        });
      }
      
      handleCloseModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteTask(taskId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Tasks</h2>
          <p className="text-slate-500 mt-1 font-medium">Track and manage your team's work</p>
        </div>
        {canCreateTask && (
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {/* Error Display */}
      {(error || tasksError || dataError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span className="text-red-800 text-sm font-medium">{error || tasksError || dataError}</span>
        </div>
      )}

      {/* Loading State */}
      {(tasksLoading || dataLoading) && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Loading tasks...</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {!tasksLoading && !dataLoading && (
        <div className="card-section">
          <div className="flex flex-col lg:flex-row gap-4 p-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
                className="input-field"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Data Table */}
      {!tasksLoading && (
        <div className="card-section overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">Title</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Assigned To</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Attachment</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <CheckSquare className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-600 font-semibold">No tasks found</p>
                        {canCreateTask && <p className="text-sm text-slate-500 mt-1">Create your first task to get started</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((filteredTask) => (
                    <tr key={filteredTask.id} className="hover:bg-slate-50 transition-colors">
                      <td className="table-cell font-semibold">
                        <div className="text-slate-900">{filteredTask.title}</div>
                        {filteredTask.description && <div className="text-xs text-slate-500 mt-0.5">{filteredTask.description.substring(0, 60)}...</div>}
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(filteredTask.status)}`}>
                          {filteredTask.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getPriorityColor(filteredTask.priority)}`}>
                          {filteredTask.priority}
                        </span>
                      </td>
                      <td className="table-cell text-sm text-slate-900">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-slate-400" />
                          {getUserName(filteredTask.assigned_to)}
                        </div>
                      </td>
                      <td className="table-cell text-sm text-slate-900">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {filteredTask.due_date ? new Date(filteredTask.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                        </div>
                      </td>
                      <td className="table-cell text-sm">
                        {filteredTask.attachment_url ? (
                          <a
                            href={filteredTask.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            title="View attachment"
                          >
                            <Paperclip className="w-4 h-4" />
                            <span>View</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          {canEditTask(filteredTask.id) && (
                            <button
                              onClick={() => handleOpenModal(filteredTask)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Task"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDeleteTask(filteredTask.id) && (
                            <button
                              onClick={() => handleDelete(filteredTask.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Add/Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 border-b border-slate-200 px-6 py-4 bg-white rounded-t-xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{editingTask ? 'Update task details and status' : 'Add a new task to your project'}</p>
              </div>
              <button
                onClick={handleCloseModal}
                aria-label="Close modal"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-red-800 text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label htmlFor="task-title" className="label-form">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  id="task-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Task title"
                  disabled={loading}
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="task-description" className="label-form">
                  Description
                </label>
                <textarea
                  rows={3}
                  id="task-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Task description"
                  disabled={loading}
                />
              </div>
              
              {/* Status and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="task-status" className="label-form">
                    Status
                  </label>
                  <select
                    id="task-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'todo' | 'in_progress' | 'review' | 'completed' })}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="task-priority" className="label-form">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              {/* Project and Assigned To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="task-project" className="label-form">
                    Project *
                  </label>
                  <select
                    id="task-project"
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    className="input-field"
                    disabled={loading || dataLoading}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="task-assigned-to" className="label-form">
                    Assigned To
                  </label>
                  <select
                    id="task-assigned-to"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    className="input-field"
                    disabled={loading || dataLoading}
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Due Date */}
              <div>
                <label htmlFor="task-due-date" className="label-form">
                  Due Date
                </label>
                <input
                  type="date"
                  id="task-due-date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              
              {/* File Upload Section */}
              <div className="border-t border-slate-200 pt-5">
                <label className="label-form">
                  Attachment (PDF only, max 3MB)
                </label>
                <div className="space-y-3">
                  {/* Current attachment display */}
                  {formData.attachment_url && !selectedFile && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Current attachment</span>
                        <a
                          href={formData.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* New file selection */}
                  {!selectedFile ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading || uploadingFile}
                        title="Upload PDF attachment"
                        aria-label="Upload PDF attachment"
                      />
                      <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                        <Paperclip className="w-5 h-5 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-600 font-medium">
                          {formData.attachment_url ? 'Replace attachment' : 'Click or drag to upload PDF'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-green-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-900 truncate">{selectedFile.name}</p>
                          <p className="text-xs text-green-700">{fileUploadService.formatFileSize(selectedFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ml-2 shrink-0"
                        disabled={loading || uploadingFile}
                        title="Remove file"
                        aria-label="Remove selected file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {uploadingFile && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>
                      <span>Uploading file...</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="border-t border-slate-200 pt-5 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                  <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;