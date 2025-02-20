import React from 'react';
import { UserCircle, Layout, CheckSquare, Calendar, Users, Settings, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  currentView: 'dashboard' | 'calendar' | 'team' | 'settings';
  onViewChange: (view: 'dashboard' | 'calendar' | 'team' | 'settings') => void;
  onLogout: () => void;
}

export function Sidebar({ userRole, userName, currentView, onViewChange, onLogout }: SidebarProps) {
  const isActive = (view: typeof currentView) => currentView === view;

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Layout className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold">TaskMaster</span>
      </div>
      
      <nav className="space-y-2">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-2 p-2 rounded w-full text-left hover:bg-gray-800 ${
            isActive('dashboard') ? 'bg-gray-800' : ''
          }`}
        >
          <Layout className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex items-center gap-2 p-2 rounded w-full text-left hover:bg-gray-800 ${
            isActive('calendar') ? 'bg-gray-800' : ''
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>
        
        {userRole === 'manager' && (
          <button
            onClick={() => onViewChange('team')}
            className={`flex items-center gap-2 p-2 rounded w-full text-left hover:bg-gray-800 ${
              isActive('team') ? 'bg-gray-800' : ''
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Team</span>
          </button>
        )}
        
        <button
          onClick={() => onViewChange('settings')}
          className={`flex items-center gap-2 p-2 rounded w-full text-left hover:bg-gray-800 ${
            isActive('settings') ? 'bg-gray-800' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-2 p-2 mb-2">
          <UserCircle className="w-8 h-8" />
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-gray-400 capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 p-2 w-full text-left text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}