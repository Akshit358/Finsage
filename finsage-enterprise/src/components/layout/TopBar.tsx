import React from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSidebarOpen, useAppActions, useNotifications, useUser } from '../../store/useStore';

const TopBar: React.FC = () => {
  const sidebarOpen = useSidebarOpen();
  const { setSidebarOpen, addNotification } = useAppActions();
  const notifications = useNotifications();
  const user = useUser();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRefresh = () => {
    addNotification({
      type: 'info',
      title: 'Refreshing Data',
      message: 'Updating market data and portfolio information...',
    });
    // Trigger refresh logic here
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-neutral-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-500">Welcome back, {user?.name || 'User'}</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search stocks, portfolios, or insights..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5 text-neutral-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors relative">
              <Bell className="h-5 w-5 text-neutral-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-neutral-900">{user?.name || 'User'}</p>
                <p className="text-xs text-neutral-500">{user?.email || 'user@example.com'}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <hr className="my-1" />
              <button 
                onClick={() => {
                  // Handle logout
                  addNotification({
                    type: 'info',
                    title: 'Logged Out',
                    message: 'You have been successfully logged out.',
                  });
                }}
                className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
