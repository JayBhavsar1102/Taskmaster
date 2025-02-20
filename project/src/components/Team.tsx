import React from 'react';
import { User, Task } from '../types';
import { Users } from 'lucide-react';

interface TeamProps {
  users: User[];
  tasks: Task[];
}

export function Team({ users, tasks }: TeamProps) {
  const executives = users.filter(user => user.role === 'executive');

  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assignedTo === userId);
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    const inProgressTasks = userTasks.filter(task => task.status === 'in-progress');
    const pendingTasks = userTasks.filter(task => task.status === 'pending');
    
    return {
      total: userTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      pending: pendingTasks.length,
      completionRate: userTasks.length ? (completedTasks.length / userTasks.length * 100).toFixed(1) : '0',
    };
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-semibold">Team Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {executives.map(user => {
          const stats = getUserStats(user.id);
          
          return (
            <div key={user.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-semibold">{stats.total}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-semibold">{stats.completionRate}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium text-green-600">{stats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-medium text-blue-600">{stats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">{stats.pending}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}