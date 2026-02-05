import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderOpen, CheckSquare, User, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

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
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col shadow-sm">
      {/* Logo/Brand Section */}
      <div className="shrink-0 p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">TaskFlow</h2>
            <p className="text-xs text-slate-500">Team Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon */}
                      <div
                        className={cn(
                          'shrink-0 w-5 h-5 transition-all duration-200',
                          isActive
                            ? 'text-blue-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Text */}
                      <span className="flex-1 text-sm font-medium truncate">
                        {item.name}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer spacer */}
      <div className="shrink-0 p-3 border-t border-slate-200" />
    </aside>
  );
};

export default Sidebar;
