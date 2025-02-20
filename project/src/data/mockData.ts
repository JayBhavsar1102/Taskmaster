import { User, Task } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Kanika Monga',
    role: 'manager',
    email: 'Kanika@JB.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Jay Bhavsar',
    role: 'executive',
    email: 'Jay@JB.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Aditya',
    role: 'executive',
    email: 'Aditya@JB.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Critical System Update',
    description: 'Implement urgent security patches for the main system',
    category: 'urgent',
    status: 'pending',
    assignedTo: '2',
    assignedBy: '1',
    deadline: '2024-03-16',
    deadlineTime: '15:00',
    createdAt: '2024-03-15',
    needsApproval: false,
    comments: [
      {
        id: '1',
        taskId: '1',
        userId: '1',
        userName: 'Kanika Monga',
        userRole: 'manager',
        content: 'This needs immediate attention. Please prioritize.',
        createdAt: '2024-03-15T08:00:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'Client Documentation',
    description: 'Update client documentation with new features',
    category: 'normal',
    status: 'in-progress',
    assignedTo: '3',
    assignedBy: '1',
    deadline: '2024-03-20',
    deadlineTime: '17:00',
    createdAt: '2024-03-15',
    needsApproval: false,
    comments: []
  },
  {
    id: '3',
    title: 'Quarterly Strategy Planning',
    description: 'Prepare and present quarterly strategy document',
    category: 'important',
    status: 'pending',
    assignedTo: '2',
    assignedBy: '1',
    deadline: '2024-03-18',
    deadlineTime: '14:00',
    createdAt: '2024-03-14',
    needsApproval: false,
    comments: []
  }
];