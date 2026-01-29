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
    <aside className="w-64 bg-linear-to-b from-slate-50 to-slate-100 border-r border-slate-200 min-h-screen shadow-lg">
      <nav className="p-6">
        <ul className="space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => {
                    return (
                      `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out relative overflow-hidden ${
                        isActive
                          ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105 border border-blue-400'
                          : 'text-slate-700 hover:bg-linear-to-r hover:from-slate-100 hover:to-slate-200 hover:text-slate-900 hover:shadow-md hover:transform hover:translate-x-2 hover:border hover:border-slate-300'
                      }`
                    );
                  }}
                  children={({ isActive }) => (
                    <>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
                      <Icon className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-medium relative z-10 group-hover:font-semibold transition-all duration-300">{item.name}</span>
                      {isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
