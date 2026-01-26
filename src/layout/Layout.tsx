import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSessionManager } from '../hooks/useSessionManager';
import Topbar from './topbar';
import Sidebar from './sidebar';

const Layout: React.FC = () => {
  // Initialize session manager to handle browser close events
  useSessionManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
