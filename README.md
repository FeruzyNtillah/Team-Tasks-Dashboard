# ImaraTech Team Tasks Dashboard

A modern React-based task management application built with TypeScript, Vite, and Supabase for team collaboration and project management.

## Features

- **Authentication**: User signup, login, and password reset with email verification
- **Project Management**: Create and manage projects with detailed views
- **Task Management**: Comprehensive task tracking and assignment
- **User Profiles**: Personal profile management
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Session Management**: Automatic session handling and cleanup
- **Real-time Updates**: Live data synchronization
- **Performance Optimization**: Optimized data fetching and caching

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
team-tasks-dashboard/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   ├── forms/         # Form components
│   │   └── tables/        # Table components
│   ├── contexts/          # React context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEmailVerification.ts
│   │   ├── useSessionManager.ts
│   │   └── useOptimizedData.ts
│   ├── layout/            # Layout components
│   │   ├── topbar.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   ├── lib/               # Utility functions and configurations
│   │   ├── supabase.client.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   ├── Tasks.tsx
│   │   ├── Profile.tsx
│   │   └── Login.tsx
│   ├── services/          # API services
│   │   ├── fileUpload.ts
│   │   └── api.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── dataOptimization.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── assets/            # Static assets
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/FeruzyNtillah/Team-Tasks-Dashboard.git
   cd Team-Tasks-Dashboard
   ```

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

The application will be available at `http://localhost:5173`

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

## Key Components

### Authentication System
- User registration and login
- Email verification
- Password reset
- Session management

### Data Management
- Optimized Supabase client with caching
- Batch processing for large datasets
- Real-time data synchronization
- Performance monitoring

### UI Components
- Responsive design with Tailwind CSS
- Modern component architecture
- Accessibility features
- Dark/light theme support

## Performance Features

- **Data Optimization**: Intelligent caching and batch processing
- **Lazy Loading**: Components and data loaded on demand
- **Memory Management**: Automatic cleanup and garbage collection
- **Network Optimization**: Debounced API calls and request deduplication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
