# Role-Based Authorization System

This document describes the comprehensive role-based authorization system implemented for the Team Tasks Dashboard application. The system enforces security at both the database level and frontend UI level according to the specified requirements.

## Overview

The authorization system implements two user roles with specific permissions:

- **Admin**: Full control over projects and tasks
- **Member**: Limited, ownership-based control

## Security Architecture

### Database-Level Security (Primary)

All authorization is enforced at the database level using Supabase Row Level Security (RLS) policies. This ensures that unauthorized actions fail even if attempted via a modified client.

### Frontend-Level Security (Secondary)

The frontend implements permission checks to provide appropriate user experience and prevent unnecessary API calls, but these are supplementary to database security.

## Role Permissions

### Admin Role
- **Projects**: Can create, view, update, and delete all projects
- **Tasks**: Can create, view, update, and delete any task regardless of assignment

### Member Role
- **Projects**: Can view all projects only
- **Tasks**: Can view all tasks, update only tasks assigned to them
- **Restrictions**: Cannot create, delete, or assign tasks

## Implementation Details

### Database Schema

The database schema includes comprehensive RLS policies:

```sql
-- Users table with role constraint
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  -- ...
);

-- RLS policies for projects
CREATE POLICY "Admins can insert projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS policies for tasks
CREATE POLICY "Members can update tasks assigned to them" ON tasks
  FOR UPDATE USING (
    assigned_to = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'member'
    )
  );
```

### Frontend Components

#### useAuthorization Hook

Central hook providing all authorization functionality:

```typescript
const {
  user,
  userRole,
  isAdmin,
  isMember,
  canCreateProject,
  canEditProject,
  canDeleteProject,
  canCreateTask,
  canEditTask,
  canDeleteTask,
  canAssignTasks,
  getTaskPermissions,
  checkProjectAccess,
  checkTaskAccess
} = useAuthorization();
```

#### PermissionButton Component

Button component with built-in permission checking:

```typescript
<PermissionButton
  allowedRoles={['admin']}
  onClick={handleDelete}
  variant="danger"
>
  Delete Project
</PermissionButton>

<PermissionButton
  hasPermission={canEditThisTask}
  onClick={handleEdit}
>
  Edit Task
</PermissionButton>
```

#### RoleGuard Component

Wrapper for conditional rendering based on roles:

```typescript
<RoleGuard allowedRoles={['admin']}>
  <DeleteButton />
</RoleGuard>

<RoleGuard fallback={<AccessDenied />}>
  <AdminOnlyContent />
</RoleGuard>
```

## Usage Examples

### Basic Permission Checks

```typescript
const { canCreateProject, canEditTask } = useAuthorization();

// Check project permissions
if (canCreateProject) {
  // Show create project button
}

// Check task-specific permissions
const canEdit = canEditTask(task, user.id);
```

### Advanced Permission Checks

```typescript
const { checkProjectAccess, checkTaskAccess } = useAuthorization();

// Detailed permission check with error messages
const projectAccess = checkProjectAccess('edit', project);
if (!projectAccess.allowed) {
  console.log(projectAccess.reason); // "Only admins can edit projects"
}

// Task-specific check
const taskAccess = checkTaskAccess('edit', task);
if (!taskAccess.allowed) {
  console.log(taskAccess.reason); // "You can only edit tasks assigned to you"
}
```

### Real-time Data with Permissions

```typescript
const {
  projects,
  canCreateProject,
  canEditProject,
  canDeleteProject,
  createProject,
  updateProject,
  deleteProject
} = useProjectsRealtime();

// All operations automatically check permissions
try {
  await createProject(projectData); // Throws if not admin
} catch (error) {
  console.error('Permission denied:', error.message);
}
```

## Security Constraints

### Database Level (Mandatory)

1. **Role Verification**: All role checks are performed against the `users.role` field linked to `auth.users`
2. **No Trust in Client**: Clients cannot self-declare roles or ownership
3. **Automatic Failure**: Unauthorized actions fail at the database level
4. **Ownership Validation**: Task updates verify assignment before allowing changes

### Frontend Level (Supplementary)

1. **UI Adaptation**: Interface adapts based on user permissions
2. **Preventative UX**: Disabled/hidden buttons for unauthorized actions
3. **Error Handling**: Graceful handling of permission denied scenarios
4. **Real-time Updates**: Permission changes reflect immediately in UI

## File Structure

```
src/
├── components/
│   ├── PermissionButton.tsx    # Permission-aware button component
│   ├── RoleGuard.tsx           # Role-based conditional rendering
│   └── ProtectedRoute.tsx      # Route protection
├── hooks/
│   ├── useAuthorization.ts     # Main authorization hook
│   ├── useUserProfile.ts       # User profile management
│   └── useProjectsRealtime.ts  # Projects with permissions
├── utils/
│   └── permissions.ts          # Permission utility functions
├── types/
│   └── index.ts                # TypeScript type definitions
└── examples/
    └── AuthorizationExample.tsx # Usage examples
```

## Testing

The authorization system includes comprehensive tests covering:

- Role-based permission checks
- Component behavior with different user roles
- Database policy enforcement
- Error handling scenarios
- Real-time permission updates

## Migration Guide

### For Existing Code

1. **Replace direct permission checks**:
   ```typescript
   // Before
   if (user.role === 'admin') { ... }
   
   // After
   const { canCreateProject } = useAuthorization();
   if (canCreateProject) { ... }
   ```

2. **Update buttons to use PermissionButton**:
   ```typescript
   // Before
   <Button onClick={handleDelete}>Delete</Button>
   
   // After
   <PermissionButton
     allowedRoles={['admin']}
     onClick={handleDelete}
   >
     Delete
   </PermissionButton>
   ```

3. **Add RoleGuard for conditional sections**:
   ```typescript
   <RoleGuard allowedRoles={['admin']}>
     <AdminControls />
   </RoleGuard>
   ```

### Database Setup

Run the provided SQL schema to set up RLS policies:

```bash
# Execute in Supabase SQL Editor
psql -f supabase-schema.sql
```

## Best Practices

1. **Always use database-level permissions** for security-critical operations
2. **Implement frontend permissions** for better UX but never rely on them for security
3. **Use the useAuthorization hook** as the single source of truth for permissions
4. **Test with both user roles** to ensure proper behavior
5. **Handle permission errors gracefully** with user-friendly messages
6. **Keep permission logic centralized** in the permission utilities

## Troubleshooting

### Common Issues

1. **Permission denied errors**: Check RLS policies and user role in database
2. **UI not updating**: Ensure useAuthorization hook is properly integrated
3. **Role not loading**: Verify user profile creation trigger is working
4. **Real-time issues**: Check Supabase subscription setup

### Debug Tools

- Use the AuthorizationExample component to verify permissions
- Check browser console for permission-related logs
- Verify database RLS policies in Supabase dashboard
- Test with different user roles to isolate issues

## Security Considerations

1. **Never trust client-side permissions** for security decisions
2. **Always validate permissions at database level**
3. **Use parameterized queries** to prevent SQL injection
4. **Implement proper session management**
5. **Regularly review and audit permissions**
6. **Monitor for unauthorized access attempts**

This authorization system provides a robust, secure foundation for role-based access control that meets all specified requirements while maintaining flexibility for future enhancements.
