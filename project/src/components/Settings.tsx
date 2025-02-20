import React from 'react';
import { User } from '../types';
import { Settings as SettingsIcon, LogOut } from 'lucide-react';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

export function Settings({ user, onLogout }: SettingsProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}