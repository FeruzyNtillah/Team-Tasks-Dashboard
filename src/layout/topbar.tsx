import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSessionManager } from '../hooks/useSessionManager';

const Topbar: React.FC = () => {
  const { user } = useAuth();
  const { clearSession } = useSessionManager();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await clearSession();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Team Tasks Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" aria-label="Notifications">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={handleProfileClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          
          <button 
            onClick={handleSignOut}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
          
          {user && (
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-sm text-gray-700">
                {user.email?.split('@')[0] || 'User'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
