// Service de temps réel pour SENEGEL ERP
// Gestion des notifications, synchronisation et collaboration en temps réel

import { realtimeService } from './backendlessService';

export const senegelRealtimeService = {
  // Écouter les changements de projets
  subscribeToProjects(callback: (project: any) => void) {
    return realtimeService.subscribeToChanges('Projects', callback);
  },

  // Écouter les changements de cours
  subscribeToCourses(callback: (course: any) => void) {
    return realtimeService.subscribeToChanges('Courses', callback);
  },

  // Écouter les changements de tâches
  subscribeToTasks(callback: (task: any) => void) {
    return realtimeService.subscribeToChanges('Tasks', callback);
  },

  // Écouter les notifications
  subscribeToNotifications(callback: (notification: any) => void) {
    return realtimeService.subscribeToChanges('Notifications', callback);
  },

  // Envoyer une notification de projet
  async notifyProjectUpdate(projectId: string, action: string, userId: string) {
    const notification = {
      type: 'project_update',
      message: `Projet ${action}`,
      projectId,
      userId,
      read: false,
      createdAt: new Date().toISOString()
    };
    return await realtimeService.sendNotification(notification);
  },

  // Envoyer une notification de cours
  async notifyCourseUpdate(courseId: string, action: string, userId: string) {
    const notification = {
      type: 'course_update',
      message: `Cours ${action}`,
      courseId,
      userId,
      read: false,
      createdAt: new Date().toISOString()
    };
    return await realtimeService.sendNotification(notification);
  },

  // Envoyer une notification de tâche
  async notifyTaskUpdate(taskId: string, action: string, userId: string) {
    const notification = {
      type: 'task_update',
      message: `Tâche ${action}`,
      taskId,
      userId,
      read: false,
      createdAt: new Date().toISOString()
    };
    return await realtimeService.sendNotification(notification);
  },

  // Notifications système
  async notifySystem(message: string, type: string = 'info', userId?: string) {
    const notification = {
      type: 'system',
      message,
      systemType: type,
      userId: userId || 'all',
      read: false,
      createdAt: new Date().toISOString()
    };
    return await realtimeService.sendNotification(notification);
  },

  // Notifications de collaboration
  async notifyCollaboration(
    type: 'mention' | 'comment' | 'assignment',
    entityId: string,
    entityType: string,
    fromUserId: string,
    toUserId: string,
    message: string
  ) {
    const notification = {
      type: 'collaboration',
      collaborationType: type,
      entityId,
      entityType,
      fromUserId,
      toUserId,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    return await realtimeService.sendNotification(notification);
  }
};

export default senegelRealtimeService;
