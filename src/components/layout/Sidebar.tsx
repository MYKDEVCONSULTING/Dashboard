import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { hasPermission } from '../../utils/permissions';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar, language } = useApp();
  const { t } = useTranslation(language);

  const navigationItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: t('dashboard'),
      permission: null
    },
    {
      path: '/users',
      icon: Users,
      label: t('users'),
      permission: 'canManageUsers' as const
    },
    {
      path: '/notifications',
      icon: Bell,
      label: t('notifications'),
      permission: null
    },
    {
      path: '/settings',
      icon: Settings,
      label: t('settings'),
      permission: null
    }
  ];

  const visibleItems = navigationItems.filter(item => 
    !item.permission || hasPermission(user, item.permission)
  );

  return (
    <motion.aside
      className={`
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        h-full flex flex-col transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
      `}
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
    >
      {/* Toggle button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-end">
        <motion.button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
                ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <motion.span
                  className="font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User info section (quand sidebar étendue) */}
      {!sidebarCollapsed && user && (
        <motion.div
          className="p-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t(user.role)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};