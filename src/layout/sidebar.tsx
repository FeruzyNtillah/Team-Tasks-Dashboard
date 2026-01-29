import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderOpen, CheckSquare, User, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderOpen,
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-linear-to-b from-slate-50 to-slate-100 border-r border-slate-200 min-h-screen shadow-xl">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
            <p className="text-xs text-slate-500">Team Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => {
                    return (
                      `group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out ${
                        isActive
                          ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                          : 'text-slate-700 hover:bg-linear-to-r hover:from-slate-100 hover:to-slate-200 hover:text-slate-900 hover:shadow-md hover:translate-x-1'
                      }`
                    );
                  }}
                  children={({ isActive }) => (
                    <>
                      {/* Shimmer effect for hover state */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-0 group-hover:opacity-100 rounded-xl"></div>
                      
                      {/* Icon container */}
                      <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 shadow-inner' 
                          : 'bg-slate-100 group-hover:bg-white/50 group-hover:shadow-sm'
                      }`}>
                        <Icon className={`w-4 h-4 transition-all duration-300 ${
                          isActive 
                            ? 'text-white' 
                            : 'text-slate-600 group-hover:text-slate-800 group-hover:scale-110'
                        }`} />
                      </div>
                      
                      {/* Text */}
                      <span className={`font-medium relative z-10 transition-all duration-300 ${
                        isActive 
                          ? 'text-white font-semibold' 
                          : 'text-slate-700 group-hover:text-slate-900 group-hover:font-semibold'
                      }`}>
                        {item.name}
                      </span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                        </div>
                      )}
                      
                      {/* Hover indicator */}
                      {!isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-1 h-6 bg-slate-300 rounded-full group-hover:bg-blue-400 group-hover:h-8 transition-all duration-300"></div>
                        </div>
                      )}
                    </>
                  )}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
