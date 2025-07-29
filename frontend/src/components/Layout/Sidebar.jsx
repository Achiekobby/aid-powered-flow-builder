import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Folder, 
  BarChart3, 
  Users, 
  CreditCard, 
  HelpCircle,
  X,
  User
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'My Projects', icon: Folder, href: '/dashboard/projects', current: location.pathname === '/dashboard/projects' },
    { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', current: location.pathname === '/dashboard/analytics' },
    { name: 'Users', icon: Users, href: '/dashboard/users', current: location.pathname === '/dashboard/users' },
    { name: 'Billing', icon: CreditCard, href: '/dashboard/billing', current: location.pathname === '/dashboard/billing' },
    { name: 'Support', icon: HelpCircle, href: '/dashboard/support', current: location.pathname === '/dashboard/support' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:inset-auto lg:w-64 lg:flex-shrink-0 lg:h-screen`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header - Fixed */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 flex-shrink-0 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">USSD Builder</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation - Independent Scroll */}
          <div className="flex-1 overflow-hidden">
            <nav className="h-full px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                    item.current
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-md'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${
                    item.current ? 'text-white' : 'text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer - Fixed */}
          <div className="p-4 border-t border-white/10 flex-shrink-0 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-800/50 to-purple-800/50 rounded-xl border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-emerald-300">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;