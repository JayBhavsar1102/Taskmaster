import React from 'react';
import { Task } from '../types';

interface TaskTimelineProps {
  tasks: Task[];
}

export function TaskTimeline({ tasks }: TaskTimelineProps) {
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-shrink-0 w-16 text-sm text-gray-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex-grow">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
              
              <span className="text-sm text-gray-500">
                Due: {new Date(task.deadline).toLocaleDateString()}
              </span>
              
              {task.isDaily && (
                <span className="text-sm text-gray-500">
                  {task.startTime} - {task.endTime}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}