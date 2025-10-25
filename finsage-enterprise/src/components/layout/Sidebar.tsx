import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  PieChart, 
  Bot, 
  MessageSquare, 
  Link as LinkIcon, 
  Settings, 
  Home,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSidebarOpen, useAppActions } from '../../store/useStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'AI Predictions', href: '/predictions', icon: Brain },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Robo-Advisor', href: '/robo-advisor', icon: Bot },
  { name: 'Sentiment', href: '/sentiment', icon: MessageSquare },
  { name: 'Blockchain', href: '/blockchain', icon: LinkIcon },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const sidebarOpen = useSidebarOpen();
  const { setSidebarOpen } = useAppActions();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-neutral-900">FinSage</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-neutral-200 p-4">
            <div className="text-xs text-neutral-500 text-center">
              FinSage Enterprise v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
