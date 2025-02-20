import React, { useState } from 'react';
import { Users, CheckCircle, AlertCircle, Clock, Calendar, TrendingUp, FileText, Star } from 'lucide-react';
import { Task, User, UserRole } from '../types';
import { ProductivityMetrics } from './ProductivityMetrics';
import { TaskTimeline } from './TaskTimeline';

interface DashboardProps {
  tasks: Task[];
  users: User[];
  userRole: UserRole;
  currentUser: User;
}

export function Dashboard({ tasks, users, userRole, currentUser }: DashboardProps) {
  const [selectedUser, setSelectedUser] = useState<string>(currentUser.id);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const isManager = userRole === 'manager';
  const filteredTasks = isManager 
    ? selectedUser === currentUser.id 
      ? tasks 
      : tasks.filter(t => t.assignedTo === selectedUser)
    : tasks.filter(t => t.assignedTo === currentUser.id);

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = filteredTasks.filter(t => new Date(t.deadline) < new Date()).length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress').length;

  const getTimeRangeData = () => {
    const now = new Date();
    const ranges = {
      day: new Date(now.setDate(now.getDate() - 1)),
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setMonth(now.getMonth() - 1))
    };
    return filteredTasks.filter(t => new Date(t.createdAt) > ranges[timeRange]);
  };

  const timeRangeData = getTimeRangeData();
  const onTimeCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : '0';

  const getAverageRating = () => {
    const ratedTasks = filteredTasks.filter(t => t.rating);
    if (ratedTasks.length === 0) return 0;
    const totalRating = ratedTasks.reduce((sum, task) => sum + (task.rating?.rating || 0), 0);
    return (totalRating / ratedTasks.length).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {isManager ? 'Team Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-600">
            Performance overview for {timeRange}
          </p>
        </div>
        
        {isManager && (
          <div className="flex items-center gap-4">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value={currentUser.id}>Overview (All)</option>
              {users
                .filter(u => u.role === 'executive')
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as 'day' | 'week' | 'month')}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">vs last {timeRange}</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Completed Tasks</p>
          <h3 className="text-2xl font-bold">{completedTasks}</h3>
          <div className="mt-2 text-sm text-green-600">
            +{((completedTasks / (totalTasks || 1)) * 100).toFixed(0)}% completion rate
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <h3 className="text-2xl font-bold">{inProgressTasks}</h3>
          <div className="mt-2 text-sm text-yellow-600">
            {((inProgressTasks / (totalTasks || 1)) * 100).toFixed(0)}% of total tasks
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Overdue</p>
          <h3 className="text-2xl font-bold">{overdueTasks}</h3>
          <div className="mt-2 text-sm text-red-600">
            {((overdueTasks / (totalTasks || 1)) * 100).toFixed(0)}% of total tasks
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">On-time Completion</p>
          <h3 className="text-2xl font-bold">{onTimeCompletionRate}%</h3>
          <div className="mt-2 text-sm text-green-600">
            Last {timeRange} performance
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <h3 className="text-2xl font-bold">{getAverageRating()}</h3>
          <div className="mt-2 text-sm text-purple-600">
            Based on completed tasks
          </div>
        </div>
      </div>

      {/* Productivity Metrics and Timeline */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Productivity Metrics</h2>
          <ProductivityMetrics tasks={filteredTasks} timeRange={timeRange} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Task Timeline</h2>
          <TaskTimeline tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}