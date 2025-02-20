import { User, Task, Notification as AppNotification } from '../types';

class NotificationService {
  private static instance: NotificationService;
  private notifications: AppNotification[] = [];

  private constructor() {
    if ('Notification' in window) {
      window.Notification.requestPermission();
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private createNotification(notification: AppNotification) {
    this.notifications.push(notification);
    
    // Show browser notification if permitted
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification(notification.message);
    }

    return notification;
  }

  public notifyTaskAssigned(task: Task, executive: User, manager: User): void {
    const executiveNotification = this.createNotification({
      id: crypto.randomUUID(),
      type: 'task_assigned',
      taskId: task.id,
      userId: executive.id,
      message: `📝 Hi ${executive.name}, a new task, "${task.title}", is now assigned to you. Let's make it a success!`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  public notifyTaskStarted(task: Task, executive: User, manager: User): void {
    const managerNotification = this.createNotification({
      id: crypto.randomUUID(),
      type: 'task_started',
      taskId: task.id,
      userId: manager.id,
      message: `🚀 ${executive.name} has started working on "${task.title}". Progress is underway!`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  public notifyTaskCompleted(task: Task, executive: User, manager: User, nextTask?: Task): void {
    // Notify manager
    const managerNotification = this.createNotification({
      id: crypto.randomUUID(),
      type: 'task_completed',
      taskId: task.id,
      userId: manager.id,
      message: `✅ ${executive.name} has completed "${task.title}". Time to review the results!`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify executive
    const message = nextTask 
      ? `🔄 Well done! "${task.title}" is complete. Now, it's time to jump on your next task, "${nextTask.title}", if ready.`
      : `🎉 Great job! You've completed all your tasks for today. Time to relax and recharge!`;

    const executiveNotification = this.createNotification({
      id: crypto.randomUUID(),
      type: 'task_completed',
      taskId: task.id,
      userId: executive.id,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  public getNotificationsForUser(userId: string): AppNotification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  public markAsRead(notificationId: string): void {
    this.notifications = this.notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
  }
}

export const notificationService = NotificationService.getInstance();