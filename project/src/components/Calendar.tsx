import React, { useState } from 'react';
import { Task, User } from '../types';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';

interface CalendarProps {
  tasks: Task[];
  users: User[];
}

export function Calendar({ tasks, users }: CalendarProps) {
  const [selectedExecutive, setSelectedExecutive] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const filteredTasks = tasks.filter(task => {
    if (selectedExecutive !== 'all' && task.assignedTo !== selectedExecutive) {
      return false;
    }
    return true;
  });

  const getTasksForDay = (day: number) => {
    return filteredTasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentMonth &&
        taskDate.getFullYear() === currentYear
      );
    });
  };

  const executives = users.filter(user => user.role === 'executive');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">Calendar</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">All Executives</option>
            {executives.map(exec => (
              <option key={exec.id} value={exec.id}>{exec.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="h-32" />
          ))}
          
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === today.getDate();
            const isSelected = selectedDate === `${currentYear}-${currentMonth + 1}-${day}`;
            
            return (
              <div key={day}>
                <div
                  onClick={() => setSelectedDate(`${currentYear}-${currentMonth + 1}-${day}`)}
                  className={`h-32 border rounded-lg p-2 cursor-pointer transition-colors ${
                    isToday ? 'bg-blue-50 border-blue-500' : 
                    isSelected ? 'bg-blue-100 border-blue-600' :
                    'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium mb-2">{day}</div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded truncate ${
                          task.category === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : task.category === 'important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && dayTasks.length > 0 && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                          Tasks for {new Date(selectedDate).toLocaleDateString()}
                        </h3>
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                      <div className="space-y-4">
                        {dayTasks.map(task => (
                          <div
                            key={task.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                task.category === 'urgent'
                                  ? 'bg-red-100 text-red-800'
                                  : task.category === 'important'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {task.category}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>Due: {task.deadlineTime}</span>
                              <span>Assigned to: {users.find(u => u.id === task.assignedTo)?.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}