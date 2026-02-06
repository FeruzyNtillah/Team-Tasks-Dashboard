import React, { useState } from 'react';
import { Plus, Eye, Edit2, Trash2, AlertCircle, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectsOptimized } from '../hooks/useProjectsOptimized';
import type { Project } from '../types';

const Projects: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    status: 'active' | 'completed' | 'archived';
  }>({
    name: '',
    description: '',
    status: 'active'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    createProject,
    updateProject,
    deleteProject
  } = useProjectsOptimized();

  const handleCreateProject = async () => {
    if (!formData.name || !formData.description) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createProject({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        created_by: '', // Will be set by the hook
        team_members: []
      });
      
      setFormData({ name: '', description: '', status: 'active' });
      setShowCreateModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status || 'active'
    });
    setShowCreateModal(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject || !formData.name || !formData.description) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateProject(editingProject.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status
      });
      
      setFormData({ name: '', description: '', status: 'active' });
      setEditingProject(null);
      setShowCreateModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteProject(projectId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', status: 'active' });
    setEditingProject(null);
    setError(null);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Projects</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and track all your projects</p>
        </div>
        {canCreateProject && (
          <button
            onClick={() => {
              setEditingProject(null);
              setFormData({ name: '', description: '', status: 'active' });
              setShowCreateModal(true);
            }}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Error Display */}
      {(error || projectsError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span className="text-red-800 text-sm font-medium">{error || projectsError}</span>
        </div>
      )}

      {/* Loading State */}
      {projectsLoading && (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Loading projects...</p>
          </div>
        </div>
      )}

      {/* Projects Data Table */}
      {!projectsLoading && (
        <div className="card-section overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Created At</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FolderOpen className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-600 font-semibold">No projects found</p>
                        {canCreateProject && <p className="text-sm text-slate-500 mt-1">Create your first project to get started</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                      <td className="table-cell font-semibold text-slate-900">{project.name}</td>
                      <td className="table-cell text-slate-600 max-w-xs truncate">{project.description}</td>
                      <td className="table-cell">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          project.status === 'active' ? 'badge-success' :
                          project.status === 'completed' ? 'badge-info' :
                          'badge-neutral'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="table-cell text-sm text-slate-500">
                        {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/projects/${project.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Project"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {canEditProject() && (
                            <button
                              onClick={() => handleEditProject(project)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Project"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {canDeleteProject() && (
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Project"
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

      {/* Create/Edit Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{editingProject ? 'Update project details' : 'Add a new project to your dashboard'}</p>
            </div>
            
            <div className="px-6 py-6">
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-red-800 text-sm font-medium">{error}</span>
                </div>
              )}
              
              <form className="space-y-4">
                <div>
                  <label className="label-form">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Website Redesign"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="label-form">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Describe your project..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="label-form">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'archived' })}
                    className="input-field"
                    disabled={loading}
                    aria-label="Project status"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={resetForm}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={editingProject ? handleUpdateProject : handleCreateProject}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
