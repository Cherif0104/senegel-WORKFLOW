// Service Backendless pour SENEGEL ERP
// Remplace notre backend custom par Backendless

import Backendless from 'backendless';

// Configuration Backendless - SENEGEL ERP
const APP_ID = 'BFF193CE-2006-4CA2-8DC0-B5A32EB8CCE7';
const API_KEY = 'A763EE64-2587-4223-8224-3D77C4B3C65A';

// Initialisation Backendless
Backendless.initApp({
  appId: APP_ID,
  apiKey: API_KEY
});

// ========================================
// AUTHENTIFICATION & UTILISATEURS
// ========================================

export const authService = {
  // Connexion utilisateur
  async login(email: string, password: string) {
    try {
      const result = await Backendless.UserService.login(email, password);
      return {
        success: true,
        user: {
          id: result.objectId,
          name: result.name,
          email: result.email,
          role: result.role,
          avatar: result.avatar,
          skills: result.skills || []
        },
        token: result['user-token']
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Inscription utilisateur
  async register(userData: any) {
    try {
      const user = new Backendless.User();
      user.email = userData.email;
      user.password = userData.password;
      user.name = userData.name;
      user.role = userData.role;
      user.skills = userData.skills || [];

      const result = await Backendless.UserService.register(user);
      return { success: true, user: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Déconnexion
  async logout() {
    try {
      await Backendless.UserService.logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Vérifier la session
  async getCurrentUser() {
    try {
      const user = await Backendless.UserService.getCurrentUser();
      return {
        success: true,
        user: {
          id: user.objectId,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          skills: user.skills || []
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// GESTION DES PROJETS
// ========================================

export const projectService = {
  // Créer un projet
  async createProject(projectData: any) {
    try {
      const result = await Backendless.Data.of('Projects').save(projectData);
      return { success: true, project: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer tous les projets
  async getProjects(userId?: string) {
    try {
      const query = userId ? `userId = '${userId}'` : '';
      const result = await Backendless.Data.of('Projects').find(query);
      return { success: true, projects: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mettre à jour un projet
  async updateProject(projectId: string, projectData: any) {
    try {
      const result = await Backendless.Data.of('Projects').save({ objectId: projectId, ...projectData });
      return { success: true, project: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Supprimer un projet
  async deleteProject(projectId: string) {
    try {
      await Backendless.Data.of('Projects').remove(projectId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// GESTION DES COURS
// ========================================

export const courseService = {
  // Créer un cours
  async createCourse(courseData: any) {
    try {
      const result = await Backendless.Data.of('Courses').save(courseData);
      return { success: true, course: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer tous les cours
  async getCourses() {
    try {
      const result = await Backendless.Data.of('Courses').find();
      return { success: true, courses: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mettre à jour un cours
  async updateCourse(courseId: string, courseData: any) {
    try {
      const result = await Backendless.Data.of('Courses').save({ objectId: courseId, ...courseData });
      return { success: true, course: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// GESTION DES TÂCHES
// ========================================

export const taskService = {
  // Créer une tâche
  async createTask(taskData: any) {
    try {
      const result = await Backendless.Data.of('Tasks').save(taskData);
      return { success: true, task: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer les tâches d'un projet
  async getTasksByProject(projectId: string) {
    try {
      const result = await Backendless.Data.of('Tasks').find(`projectId = '${projectId}'`);
      return { success: true, tasks: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mettre à jour une tâche
  async updateTask(taskId: string, taskData: any) {
    try {
      const result = await Backendless.Data.of('Tasks').save({ objectId: taskId, ...taskData });
      return { success: true, task: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// TEMPS RÉEL & NOTIFICATIONS
// ========================================

export const realtimeService = {
  // Écouter les changements en temps réel
  subscribeToChanges(tableName: string, callback: (data: any) => void) {
    const subscription = Backendless.Data.of(tableName).rt().addUpdateListener(callback);
    return subscription;
  },

  // Envoyer une notification
  async sendNotification(notificationData: any) {
    try {
      const result = await Backendless.Data.of('Notifications').save(notificationData);
      return { success: true, notification: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// GESTION DES FICHIERS
// ========================================

export const fileService = {
  // Uploader un fichier
  async uploadFile(file: File, folder?: string) {
    try {
      const result = await Backendless.Files.upload(file, folder || 'uploads');
      return { success: true, fileUrl: result.fileURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Supprimer un fichier
  async deleteFile(fileUrl: string) {
    try {
      await Backendless.Files.remove(fileUrl);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// ANALYTICS & REPORTING
// ========================================

export const analyticsService = {
  // Enregistrer un événement
  async trackEvent(eventName: string, eventData: any) {
    try {
      const result = await Backendless.Data.of('Analytics').save({
        eventName,
        eventData,
        timestamp: new Date(),
        userId: Backendless.UserService.getCurrentUser()?.objectId
      });
      return { success: true, event: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer les métriques
  async getMetrics(timeRange: string) {
    try {
      const query = `timestamp >= '${timeRange}'`;
      const result = await Backendless.Data.of('Analytics').find(query);
      return { success: true, metrics: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default Backendless;
