// Service Supabase pour SENEGEL ERP
// Architecture hybride : Backendless + Supabase

import { supabase } from '../utils/supabase/client';
import { User, Project, Course, TimeLog, LeaveRequest, Invoice, Expense, Contact, Document } from '../types';

// ========================================
// AUTHENTIFICATION SUPABASE
// ========================================

export const supabaseAuthService = {
  // Connexion utilisateur
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          email: data.user.email!,
          role: data.user.user_metadata?.role || 'apprenant',
          avatar: data.user.user_metadata?.avatar || `https://picsum.photos/seed/${data.user.id}/100/100`,
          skills: data.user.user_metadata?.skills || []
        },
        session: data.session
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Inscription utilisateur
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    skills?: string[];
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            skills: userData.skills || []
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Déconnexion
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Utilisateur actuel
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user: {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          email: user.email!,
          role: user.user_metadata?.role || 'apprenant',
          avatar: user.user_metadata?.avatar || `https://picsum.photos/seed/${user.id}/100/100`,
          skills: user.user_metadata?.skills || []
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'apprenant',
          avatar: session.user.user_metadata?.avatar || `https://picsum.photos/seed/${session.user.id}/100/100`,
          skills: session.user.user_metadata?.skills || []
        });
      } else {
        callback(null);
      }
    });
  }
};

// ========================================
// GESTION DES UTILISATEURS SUPABASE
// ========================================

export const supabaseUserService = {
  // Récupérer tous les utilisateurs
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, users: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(userId: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// GESTION DES PROJETS SUPABASE
// ========================================

export const supabaseProjectService = {
  // Créer un projet
  async createProject(projectData: Omit<Project, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, project: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer tous les projets
  async getProjects(userId?: string) {
    try {
      let query = supabase.from('projects').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, projects: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Mettre à jour un projet
  async updateProject(projectId: string, updates: Partial<Project>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, project: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// TEMPS RÉEL SUPABASE
// ========================================

export const supabaseRealtimeService = {
  // Écouter les changements en temps réel
  subscribeToTable(tableName: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        callback
      )
      .subscribe();
  },

  // Écouter les changements d'un projet spécifique
  subscribeToProject(projectId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`project_${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        callback
      )
      .subscribe();
  }
};

// ========================================
// STOCKAGE DE FICHIERS SUPABASE
// ========================================

export const supabaseStorageService = {
  // Uploader un fichier
  async uploadFile(bucket: string, filePath: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        return { success: false, error: error.message };
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { 
        success: true, 
        filePath: data.path,
        publicUrl: urlData.publicUrl 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Supprimer un fichier
  async deleteFile(bucket: string, filePath: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Lister les fichiers d'un bucket
  async listFiles(bucket: string, folder?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, files: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ========================================
// ANALYTICS SUPABASE
// ========================================

export const supabaseAnalyticsService = {
  // Enregistrer un événement
  async trackEvent(eventName: string, eventData: any) {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .insert([{
          event_name: eventName,
          event_data: eventData,
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, event: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Récupérer les métriques
  async getMetrics(timeRange: string = '7d') {
    try {
      const startDate = new Date();
      if (timeRange === '7d') startDate.setDate(startDate.getDate() - 7);
      else if (timeRange === '30d') startDate.setDate(startDate.getDate() - 30);

      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, metrics: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export default supabase;
