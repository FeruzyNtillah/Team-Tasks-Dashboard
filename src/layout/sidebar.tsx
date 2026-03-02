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
    <aside className="w-64 bg-linear-to-br from-white via-violet-50/20 to-cyan-50/10 backdrop-blur-sm border-r border-violet-200/50 min-h-screen flex flex-col shadow-lg shadow-violet-500/5 sticky top-0">
      {/* Logo/Brand Section */}
      <div className="shrink-0 p-6 border-b border-violet-200/50 bg-linear-to-br from-violet-50 to-purple-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-violet-500 via-purple-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold bg-linear-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent truncate">TaskFlow</h2>
            <p className="text-xs text-violet-600 font-medium">Team Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 font-medium',
                      isActive
                        ? 'bg-linear-to-r from-violet-100 via-purple-50 to-cyan-100 text-violet-700 shadow-md border-l-4 border-violet-600 pl-3'
                        : 'text-slate-600 hover:text-violet-700 hover:bg-linear-to-r from-violet-50/50 to-purple-50/30'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon */}
                      <div
                        className={cn(
                          'shrink-0 w-5 h-5 transition-all duration-300',
                          isActive
                            ? 'text-violet-600'
                            : 'text-slate-400 group-hover:text-violet-500'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Text */}
                      <span className="flex-1 text-sm font-medium truncate">
                        {item.name}
                      </span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-linear-to-r from-violet-600 to-purple-600 shadow-sm" />
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
      <div className="shrink-0 p-4 border-t border-violet-200/50 bg-linear-to-br from-violet-50/30 to-cyan-50/20">
        <p className="text-xs text-violet-500 text-center font-medium">ImaraTech © 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
