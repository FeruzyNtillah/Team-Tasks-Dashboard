# Project Structure Documentation

This document provides a comprehensive overview of the Team Tasks Dashboard project structure and organization.

## Directory Structure

```
team-tasks-dashboard/
├── public/                     # Static assets and public files
├── src/                        # Main source code
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── components/             # Reusable React components
│   │   ├── ProtectedRoute.tsx  # Authentication wrapper component
│   │   └── ui/                 # UI components (presentational)
│   │       └── index.ts        # UI components exports
│   ├── contexts/               # React context providers
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/                  # Custom React hooks
│   │   ├── useEmailVerification.ts  # Email verification hook
│   │   └── useSessionManager.ts     # Session management hook
│   ├── layout/                 # Layout components
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx         # Sidebar navigation
│   │   └── TopBar.tsx          # Top navigation bar
│   ├── lib/                    # Library configurations
│   │   └── supabase.client.ts  # Supabase client configuration
│   ├── pages/                  # Page components
│   │   ├── Home.tsx            # Dashboard home page
│   │   ├── Login.tsx           # Login page
│   │   ├── Signup.tsx          # Sign up page
│   │   ├── ForgotPassword.tsx  # Password reset page
│   │   ├── Projects.tsx        # Projects list page
│   │   ├── ProjectDetail.tsx   # Project details page
│   │   ├── Tasks.tsx           # Tasks management page
│   │   ├── Profile.tsx         # User profile page
│   │   └── Settings.tsx        # Settings page
│   ├── services/               # API service layer
│   │   └── api.ts              # API functions and utilities
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Type exports
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts        # Application constants
│   │   └── helpers.ts          # Helper functions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── README.md                   # Project documentation
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.node.json          # Node.js TypeScript config
├── vite.config.ts              # Vite build configuration
└── eslint.config.js            # ESLint configuration
```

## Component Organization

### `/src/components/`
Contains all reusable React components.

- **ProtectedRoute.tsx**: Higher-order component for protecting authenticated routes
- **ui/**: Presentational UI components that are reusable across the application

### `/src/contexts/`
React context providers for global state management.

- **AuthContext.tsx**: Authentication state and methods

### `/src/hooks/`
Custom React hooks for reusable logic.

- **useEmailVerification.ts**: Email verification functionality
- **useSessionManager.ts**: Session lifecycle management

### `/src/layout/`
Layout-related components that structure the application UI.

- **Layout.tsx**: Main layout wrapper with sidebar and topbar
- **Sidebar.tsx**: Navigation sidebar component
- **TopBar.tsx**: Top navigation bar with user menu

### `/src/pages/`
Page-level components representing different routes.

- **Home.tsx**: Dashboard and overview page
- **Login.tsx**: User authentication page
- **Signup.tsx**: User registration page
- **ForgotPassword.tsx**: Password recovery page
- **Projects.tsx**: Projects listing and management
- **ProjectDetail.tsx**: Individual project view
- **Tasks.tsx**: Task management interface
- **Profile.tsx**: User profile management
- **Settings.tsx**: Application settings

### `/src/services/`
API service layer for backend communication.

- **api.ts**: All Supabase API calls and data operations

### `/src/types/`
TypeScript type definitions and interfaces.

- **index.ts**: Centralized type exports

### `/src/utils/`
Utility functions and constants.

- **constants.ts**: Application-wide constants
- **helpers.ts**: Common utility functions

## Data Flow

### Authentication Flow
1. User interacts with auth pages (Login, Signup)
2. AuthContext manages authentication state
3. ProtectedRoute checks authentication status
4. Layout component loads for authenticated users

### Data Management
1. Services layer handles all API calls
2. Components call service functions
3. State is managed at component level or via context
4. UI updates based on state changes

### Routing Structure
- Public routes: `/login`, `/signup`, `/forgot-password`
- Protected routes: All others wrapped in Layout component
- Nested routing: Main layout contains outlet for page content

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `ProtectedRoute.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useEmailVerification.ts`)
- **Utilities**: camelCase (e.g., `constants.ts`, `helpers.ts`)
- **Types**: camelCase (e.g., `index.ts`)

### Directories
- **Plural names** for collections (e.g., `components/`, `hooks/`, `pages/`)
- **Singular names** for specific items (e.g., `layout/`, `lib/`)

### Code Style
- **TypeScript strict mode** enabled
- **ESLint** for code quality
- **Tailwind CSS** for styling
- **Functional components** with hooks
- **JSDoc comments** for documentation

## Best Practices

### Component Organization
- Keep components small and focused
- Separate presentational and container logic
- Use TypeScript interfaces for props
- Add comprehensive JSDoc comments

### State Management
- Use React Context for global state
- Keep local state in components when possible
- Use custom hooks for complex state logic
- Avoid prop drilling when possible

### API Integration
- Centralize API calls in services layer
- Use consistent error handling
- Implement proper loading states
- Handle edge cases gracefully

### Code Quality
- Follow TypeScript best practices
- Use ESLint for consistent code style
- Add meaningful comments and documentation
- Test components and utilities

## Development Guidelines

### Adding New Features
1. Define types in `/src/types/`
2. Create API functions in `/src/services/`
3. Build UI components in `/src/components/`
4. Create pages in `/src/pages/`
5. Add routes in `App.tsx`
6. Update documentation

### File Organization
- Group related files together
- Use index files for clean imports
- Keep directory structure flat when possible
- Follow established naming conventions

### Documentation
- Add JSDoc comments to all functions
- Update README.md for major changes
- Document complex logic in comments
- Keep this file updated with structure changes
