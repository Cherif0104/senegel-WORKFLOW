// Service d'authentification hybride Backendless + Supabase
// Utilise Backendless comme fallback et Supabase comme service principal

import { supabaseAuthService } from './supabaseService';
import { authService } from './backendlessService';
import { User } from '../types';

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: any;
  error?: string;
  source?: 'supabase' | 'backendless';
}

export const hybridAuthService = {
  // Connexion avec fallback Backendless
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // 1. Essayer Supabase en premier
      const supabaseResult = await supabaseAuthService.login(email, password);
      
      if (supabaseResult.success) {
        return {
          ...supabaseResult,
          source: 'supabase'
        };
      }

      // 2. Fallback sur Backendless
      console.log('Supabase login failed, trying Backendless...');
      const backendlessResult = await authService.login(email, password);
      
      if (backendlessResult.success) {
        return {
          ...backendlessResult,
          source: 'backendless'
        };
      }

      // 3. Les deux ont échoué
      return {
        success: false,
        error: 'Authentication failed on both Supabase and Backendless',
        source: 'backendless'
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'backendless'
      };
    }
  },

  // Inscription avec double enregistrement
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    skills?: string[];
  }): Promise<AuthResult> {
    const results = {
      supabase: { success: false, error: '' },
      backendless: { success: false, error: '' }
    };

    try {
      // 1. Inscription Supabase
      const supabaseResult = await supabaseAuthService.register(userData);
      results.supabase = {
        success: supabaseResult.success,
        error: supabaseResult.error || ''
      };

      // 2. Inscription Backendless (en parallèle)
      const backendlessResult = await authService.register(userData);
      results.backendless = {
        success: backendlessResult.success,
        error: backendlessResult.error || ''
      };

      // 3. Retourner le résultat Supabase si réussi, sinon Backendless
      if (results.supabase.success) {
        return {
          success: true,
          user: supabaseResult.user,
          source: 'supabase'
        };
      } else if (results.backendless.success) {
        return {
          success: true,
          user: backendlessResult.user,
          source: 'backendless'
        };
      } else {
        return {
          success: false,
          error: `Supabase: ${results.supabase.error}, Backendless: ${results.backendless.error}`,
          source: 'backendless'
        };
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'backendless'
      };
    }
  },

  // Déconnexion des deux services
  async logout(): Promise<AuthResult> {
    try {
      const supabaseResult = await supabaseAuthService.logout();
      const backendlessResult = await authService.logout();

      return {
        success: supabaseResult.success || backendlessResult.success,
        source: supabaseResult.success ? 'supabase' : 'backendless'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'backendless'
      };
    }
  },

  // Utilisateur actuel avec fallback
  async getCurrentUser(): Promise<AuthResult> {
    try {
      // 1. Essayer Supabase en premier
      const supabaseResult = await supabaseAuthService.getCurrentUser();
      
      if (supabaseResult.success) {
        return {
          ...supabaseResult,
          source: 'supabase'
        };
      }

      // 2. Fallback sur Backendless
      const backendlessResult = await authService.getCurrentUser();
      
      if (backendlessResult.success) {
        return {
          ...backendlessResult,
          source: 'backendless'
        };
      }

      return {
        success: false,
        error: 'No authenticated user found',
        source: 'backendless'
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'backendless'
      };
    }
  },

  // Synchronisation des utilisateurs entre les deux services
  async syncUsers(): Promise<{ success: boolean; synced: number; errors: string[] }> {
    try {
      const errors: string[] = [];
      let synced = 0;

      // Récupérer les utilisateurs Supabase
      const supabaseUsers = await supabaseAuthService.getCurrentUser();
      
      if (supabaseUsers.success) {
        // Synchroniser vers Backendless si nécessaire
        try {
          const backendlessResult = await authService.register({
            email: supabaseUsers.user!.email,
            password: 'TempPassword123', // À changer
            name: supabaseUsers.user!.name,
            role: supabaseUsers.user!.role,
            skills: supabaseUsers.user!.skills
          });
          
          if (backendlessResult.success) {
            synced++;
          } else {
            errors.push(`Failed to sync to Backendless: ${backendlessResult.error}`);
          }
        } catch (error: any) {
          errors.push(`Backendless sync error: ${error.message}`);
        }
      }

      return {
        success: errors.length === 0,
        synced,
        errors
      };

    } catch (error: any) {
      return {
        success: false,
        synced: 0,
        errors: [error.message]
      };
    }
  },

  // Vérification de la santé des services
  async healthCheck(): Promise<{
    supabase: { status: 'healthy' | 'unhealthy'; responseTime?: number };
    backendless: { status: 'healthy' | 'unhealthy'; responseTime?: number };
  }> {
    const results = {
      supabase: { status: 'unhealthy' as const },
      backendless: { status: 'unhealthy' as const }
    };

    // Test Supabase
    try {
      const startTime = Date.now();
      const supabaseResult = await supabaseAuthService.getCurrentUser();
      const responseTime = Date.now() - startTime;
      
      results.supabase = {
        status: supabaseResult.success ? 'healthy' : 'unhealthy',
        responseTime
      };
    } catch {
      results.supabase = { status: 'unhealthy' };
    }

    // Test Backendless
    try {
      const startTime = Date.now();
      const backendlessResult = await authService.getCurrentUser();
      const responseTime = Date.now() - startTime;
      
      results.backendless = {
        status: backendlessResult.success ? 'healthy' : 'unhealthy',
        responseTime
      };
    } catch {
      results.backendless = { status: 'unhealthy' };
    }

    return results;
  }
};

export default hybridAuthService;
