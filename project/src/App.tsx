import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { Login } from './components/Login';
import { Calendar } from './components/Calendar';
import { Team } from './components/Team';
import { Settings } from './components/Settings';
import { Task, User, TaskRating } from './types';
import { mockTasks, mockUsers } from './data/mockData';
import { Plus } from 'lucide-react';
import { notificationService } from './services/NotificationService';
import { webSocketService } from './services/WebSocketService';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'team' | 'settings'>('dashboard');

  React.useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = webSocketService.subscribe((message) => {
      switch (message.type) {
        case 'task_update':
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === message.payload.id ? message.payload : task
            )
          );
          break;
        case 'task_create':
          setTasks(prevTasks => [...prevTasks, message.payload]);
          break;
        case 'task_delete':
          setTasks(prevTasks => 
            prevTasks.filter(task => task.id !== message.payload.id)
          );
          break;
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogin = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
    } else {
      alert('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: (tasks.length + 1).toString(),
      ...newTask,
      status: 'pending',
      comments: [],
    } as Task;

    setTasks([...tasks, task]);
    setShowTaskForm(false);

    const executive = mockUsers.find(u => u.id === task.assignedTo);
    const manager = mockUsers.find(u => u.id === task.assignedBy);
    
    if (executive && manager) {
      notificationService.notifyTaskAssigned(task, executive, manager);
    }

    webSocketService.sendMessage({
      type: 'task_create',
      payload: task
    });
  };

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !currentUser) return;

    const updatedTask = { ...task, status: newStatus };
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? updatedTask : t
    );
    
    setTasks(updatedTasks);

    const executive = mockUsers.find(u => u.id === task.assignedTo);
    const manager = mockUsers.find(u => u.id === task.assignedBy);
    
    if (executive && manager) {
      if (newStatus === 'in-progress') {
        notificationService.notifyTaskStarted(task, executive, manager);
      } else if (newStatus === 'completed') {
        const nextTask = tasks.find(t => 
          t.assignedTo === executive.id && 
          t.status === 'pending' &&
          t.id !== task.id
        );
        notificationService.notifyTaskCompleted(task, executive, manager, nextTask);
      }
    }

    webSocketService.sendMessage({
      type: 'task_update',
      payload: updatedTask
    });
  };

  const handleAddComment = (taskId: string, content: string) => {
    if (!currentUser) return;
    
    const newComment = {
      id: Math.random().toString(),
      taskId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, comments: [...task.comments, newComment] }
        : task
    );

    setTasks(updatedTasks);

    webSocketService.sendMessage({
      type: 'task_update',
      payload: updatedTasks.find(t => t.id === taskId)
    });
  };

  const handleRateTask = (taskId: string, rating: number, comment: string) => {
    if (!currentUser || currentUser.role !== 'manager') return;

    const taskRating: TaskRating = {
      taskId,
      rating,
      comment,
      ratedBy: currentUser.id,
      ratedAt: new Date().toISOString()
    };

    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, rating: taskRating }
        : task
    );

    setTasks(updatedTasks);

    webSocketService.sendMessage({
      type: 'task_update',
      payload: updatedTasks.find(t => t.id === taskId)
    });
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const userTasks = tasks.filter(task => 
    currentUser.role === 'manager' || task.assignedTo === currentUser.id
  );

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return <Calendar tasks={userTasks} users={mockUsers} />;
      case 'team':
        return currentUser.role === 'manager' ? <Team users={mockUsers} tasks={tasks} /> : null;
      case 'settings':
        return <Settings user={currentUser} onLogout={handleLogout} />;
      default:
        return (
          <>
            <Dashboard 
              tasks={tasks}
              users={mockUsers}
              userRole={currentUser.role}
              currentUser={currentUser}
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {currentUser.role === 'manager' ? 'All Tasks' : 'My Tasks'}
                </h2>
                {currentUser.role === 'manager' && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Assign Task
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    users={mockUsers}
                    currentUser={currentUser}
                    onUpdateStatus={handleUpdateStatus}
                    onAddComment={handleAddComment}
                    onRateTask={handleRateTask}
                  />
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        userRole={currentUser.role} 
        userName={currentUser.name} 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderContent()}
      </main>

      {showTaskForm && (
        <TaskForm
          users={mockUsers}
          currentUser={currentUser}
          onSubmit={handleAddTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
}

export default App;