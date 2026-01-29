import React from 'react';
import { PermissionButton } from '../components/PermissionButton';
import { RoleGuard } from '../components/RoleGuard';
import { useAuthorization } from '../hooks/useAuthorization';
import type { Project, Task } from '../types';

/**
 * Example component demonstrating the role-based authorization system
 * 
 * This component shows how to:
 * - Use the useAuthorization hook for permission checks
 * - Implement RoleGuard for conditional rendering
 * - Use PermissionButton for action buttons with permissions
 * - Handle both project and task permissions according to the rules
 */
export const AuthorizationExample: React.FC<{
  project?: Project;
  task?: Task;
}> = ({ project, task }) => {
  const {
    user,
    userRole,
    isAdmin,
    isMember,
    loading,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canCreateTask,
    canDeleteTask,
    canAssignTasks,
    getTaskPermissions,
    checkProjectAccess,
    checkTaskAccess
  } = useAuthorization();

  // Get task-specific permissions if task is provided
  const taskPermissions = task ? getTaskPermissions(task) : null;

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Authorization System Demo</h2>
        
        {/* User Info */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Current User:</h3>
          <p>Email: {user?.email || 'Not authenticated'}</p>
          <p>Role: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userRole || 'None'}</span></p>
          <p>Is Admin: {isAdmin ? '✅ Yes' : '❌ No'}</p>
          <p>Is Member: {isMember ? '✅ Yes' : '❌ No'}</p>
        </div>

        {/* Project Permissions */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Project Permissions:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Can Create Projects: {canCreateProject ? '✅ Yes' : '❌ No'}</p>
              <p>Can Edit Projects: {canEditProject ? '✅ Yes' : '❌ No'}</p>
              <p>Can Delete Projects: {canDeleteProject ? '✅ Yes' : '❌ No'}</p>
            </div>
            <div>
              {project && (
                <>
                  <p>Can Edit This Project: {checkProjectAccess('edit', project).allowed ? '✅ Yes' : '❌ No'}</p>
                  <p>Can Delete This Project: {checkProjectAccess('delete', project).allowed ? '✅ Yes' : '❌ No'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Task Permissions */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Task Permissions:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>Can Create Tasks: {canCreateTask ? '✅ Yes' : '❌ No'}</p>
              <p>Can Delete Tasks: {canDeleteTask ? '✅ Yes' : '❌ No'}</p>
              <p>Can Assign Tasks: {canAssignTasks ? '✅ Yes' : '❌ No'}</p>
            </div>
            <div>
              {task && taskPermissions && (
                <>
                  <p>Can Edit This Task: {taskPermissions.canEdit ? '✅ Yes' : '❌ No'}</p>
                  <p>Can Change Task Status: {taskPermissions.canChangeStatus ? '✅ Yes' : '❌ No'}</p>
                  <p>Can Delete This Task: {checkTaskAccess('delete', task).allowed ? '✅ Yes' : '❌ No'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Permission-based UI Examples */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Permission-based UI Examples:</h3>
          
          {/* Using RoleGuard for conditional sections */}
          <RoleGuard allowedRoles={['admin']}>
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
              <p className="text-red-800">🔒 Admin-only content visible here</p>
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={['member']}>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
              <p className="text-blue-800">👥 Member-only content visible here</p>
            </div>
          </RoleGuard>

          {/* Using PermissionButton for actions */}
          <div className="space-y-2">
            <h4 className="font-medium">Action Buttons:</h4>
            
            <PermissionButton
              allowedRoles={['admin']}
              onClick={() => console.log('Create project')}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create New Project (Admin Only)
            </PermissionButton>

            <PermissionButton
              allowedRoles={['admin']}
              onClick={() => console.log('Create task')}
              className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
            >
              Create New Task (Admin Only)
            </PermissionButton>

            {project && (
              <PermissionButton
                hasPermission={checkProjectAccess('edit', project).allowed}
                onClick={() => console.log('Edit project')}
                className="bg-yellow-600 text-white px-4 py-2 rounded ml-2"
              >
                Edit Project
              </PermissionButton>
            )}

            {task && (
              <PermissionButton
                hasPermission={taskPermissions?.canEdit}
                onClick={() => console.log('Edit task')}
                className="bg-purple-600 text-white px-4 py-2 rounded ml-2"
              >
                Edit Task
              </PermissionButton>
            )}
          </div>
        </div>

        {/* Permission Check Results */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Permission Check Details:</h3>
          {project && (
            <div className="bg-gray-50 rounded p-3 mb-2">
              <p className="font-mono text-sm">
                Project Edit Access: {checkProjectAccess('edit', project).reason || 'Allowed'}
              </p>
            </div>
          )}
          {task && (
            <div className="bg-gray-50 rounded p-3 mb-2">
              <p className="font-mono text-sm">
                Task Edit Access: {checkTaskAccess('edit', task).reason || 'Allowed'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
