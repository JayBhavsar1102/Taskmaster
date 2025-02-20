import React, { useState } from 'react';
import { Clock, MessageSquare, CheckCircle, Play, AlertTriangle, Star } from 'lucide-react';
import { Task, User } from '../types';
import { TaskChat } from './TaskChat';
import { TaskRatingModal } from './TaskRatingModal';

interface TaskCardProps {
  task: Task;
  users: User[];
  currentUser: User;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onAddComment: (taskId: string, content: string) => void;
  onRateTask?: (taskId: string, rating: number, comment: string) => void;
}

export function TaskCard({ 
  task, 
  users, 
  currentUser, 
  onUpdateStatus, 
  onAddComment,
  onRateTask 
}: TaskCardProps) {
  const [showChat, setShowChat] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    'awaiting_approval': 'bg-purple-100 text-purple-800',
  };

  const categoryColors = {
    urgent: 'bg-red-100 text-red-800',
    normal: 'bg-blue-100 text-blue-800',
    important: 'bg-amber-100 text-amber-800',
  };

  const assignedUser = users.find(u => u.id === task.assignedTo);
  const assignedBy = users.find(u => u.id === task.assignedBy);

  const handleStatusUpdate = (newStatus: Task['status']) => {
    if (currentUser.role === 'executive' && task.assignedBy === currentUser.id) {
      onUpdateStatus(task.id, 'awaiting_approval');
    } else {
      onUpdateStatus(task.id, newStatus);
      if (newStatus === 'completed' && currentUser.role === 'manager') {
        setShowRatingModal(true);
      }
    }
  };

  const handleAddComment = (content: string) => {
    onAddComment(task.id, content);
  };

  const handleRateTask = (rating: number, comment: string) => {
    if (onRateTask) {
      onRateTask(task.id, rating, comment);
      setShowRatingModal(false);
    }
  };

  const canUpdateStatus = () => {
    if (currentUser.role === 'manager') return true;
    if (task.assignedTo === currentUser.id) return true;
    return false;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <div className="flex gap-2">
          {task.needsApproval && (
            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Needs Approval
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center gap-4 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[task.category]}`}>
          {task.category}
        </span>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          <span>{new Date(task.deadline).toLocaleDateString()} {task.deadlineTime}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img
            src={assignedUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedUser?.name || '')}`}
            alt={assignedUser?.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{assignedUser?.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {task.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{task.rating.rating}</span>
            </div>
          )}
          <button
            onClick={() => setShowChat(!showChat)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm ml-1">{task.comments.length}</span>
          </button>
        </div>
      </div>

      {canUpdateStatus() && task.status !== 'completed' && (
        <div className="flex gap-2 mt-4">
          {task.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate('in-progress')}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
            >
              <Play className="w-4 h-4" />
              Start Task
            </button>
          )}
          {task.status === 'in-progress' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Task
            </button>
          )}
        </div>
      )}

      {showChat && (
        <div className="mt-4">
          <TaskChat
            comments={task.comments}
            currentUser={currentUser}
            onAddComment={handleAddComment}
          />
        </div>
      )}

      {showRatingModal && (
        <TaskRatingModal
          taskId={task.id}
          taskTitle={task.title}
          onSubmit={handleRateTask}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}