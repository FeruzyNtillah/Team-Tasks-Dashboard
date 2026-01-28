# Team Tasks Dashboard

A modern React-based task management application built with TypeScript, Vite, and Supabase for team collaboration and project management.

## Features

- **Authentication**: User signup, login, and password reset with email verification
- **Project Management**: Create and manage projects with detailed views
- **Task Management**: Comprehensive task tracking and assignment
- **User Profiles**: Personal profile management
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Session Management**: Automatic session handling and cleanup

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Authentication & Database)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Tables**: TanStack React Table
- **Build Tools**: Vite, ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── layout/             # Layout components (Header, Sidebar)
├── pages/              # Page components
└── assets/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Lint

Run ESLint:

```bash
npm run lint
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
