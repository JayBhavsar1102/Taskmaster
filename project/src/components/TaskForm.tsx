import React, { useState } from 'react';
import { Task, User, TaskCategory, TaskStatus } from '../types';

interface TaskFormProps {
  users: User[];
  currentUser: User;
  onSubmit: (task: Partial<Task>) => void;
  onClose: () => void;
}

export function TaskForm({ users, currentUser, onSubmit, onClose }: TaskFormProps) {
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    category: 'normal',
    status: 'pending',
    assignedTo: '',
    deadline: new Date().toISOString().split('T')[0],
    deadlineTime: '09:00',
    needsApproval: currentUser.role === 'executive',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...task,
      assignedBy: currentUser.id,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {currentUser.role === 'manager' ? 'Assign New Task' : 'Request New Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={task.category}
                onChange={(e) => setTask({ ...task, category: e.target.value as TaskCategory })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="important">Important</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                value={task.assignedTo}
                onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                required
              >
                <option value="">Select User</option>
                {users
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline Date
              </label>
              <input
                type="date"
                required
                value={task.deadline}
                onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline Time
              </label>
              <input
                type="time"
                required
                value={task.deadlineTime}
                onChange={(e) => setTask({ ...task, deadlineTime: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {currentUser.role === 'manager' ? 'Assign Task' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}