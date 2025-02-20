// Define basic types
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'awaiting_approval';
export type TaskCategory = 'urgent' | 'normal' | 'important';
export type UserRole = 'manager' | 'executive';
export type NotificationType = 'task_assigned' | 'task_started' | 'task_completed' | 'new_comment' | 'task_approval_required';

// Define the User interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

// Define the Rating interface
export interface TaskRating {
  taskId: string;
  rating: number;
  comment?: string;
  ratedBy: string;
  ratedAt: string;
}

// Define the Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  assignedTo: string;
  assignedBy: string;
  deadline: string;
  deadlineTime: string;
  createdAt: string;
  comments: Comment[];
  needsApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  rating?: TaskRating;
}

// Define the Comment interface
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  attachment?: File;
}

// Define the Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  taskId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}