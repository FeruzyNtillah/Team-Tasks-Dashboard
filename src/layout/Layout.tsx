import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSessionManager } from '../hooks/useSessionManager';
import TopBar from './topbar';
import Sidebar from './sidebar';

/**
 * Main Layout Component
 * 
 * This component provides the main application layout structure including:
 * - Top navigation bar
 * - Sidebar navigation
 * - Main content area where page components are rendered
 * 
 * The layout is used for all authenticated pages and provides a consistent
 * user interface throughout the application.
 * 
 * Features:
 * - Responsive design with Tailwind CSS
 * - Session management integration
 * - Outlet for nested route rendering
 */
const Layout: React.FC = () => {
  // Initialize session manager to handle browser close events
  // This ensures proper cleanup when users close the browser window
  useSessionManager();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar with user menu and notifications */}
      <TopBar />
      
      {/* Main content area with sidebar and page content */}
      <div className="flex">
        {/* Sidebar navigation */}
        <Sidebar />
        
        {/* Main content area where pages are rendered */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
