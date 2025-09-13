// Composant de migration hybride Backendless + Supabase
import React, { useState, useEffect } from 'react';
import { supabaseAuthService, supabaseProjectService, supabaseUserService } from '../services/supabaseService';
import { authService, projectService } from '../services/backendlessService';
import { mockAllUsers, mockProjects } from '../constants/data';

const HybridMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleHybridMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    setProgress(0);
    
    try {
      const results = {
        backendless: { success: 0, failed: 0, errors: [] },
        supabase: { success: 0, failed: 0, errors: [] }
      };

      // Étape 1: Migration Backendless (existante)
      setCurrentStep('🔄 Migration Backendless...');
      setProgress(10);
      
      const backendlessUsers = Object.values(mockAllUsers);
      for (const user of backendlessUsers) {
        try {
          const result = await authService.register({
            email: user.email,
            password: 'Senegel2025!',
            name: user.name,
            role: user.role,
            skills: user.skills || []
          });
          
          if (result.success) {
            results.backendless.success++;
          } else {
            results.backendless.failed++;
            results.backendless.errors.push(`${user.name}: ${result.error}`);
          }
        } catch (error: any) {
          results.backendless.failed++;
          results.backendless.errors.push(`${user.name}: ${error.message}`);
        }
      }
      
      setProgress(50);

      // Étape 2: Migration Supabase (nouvelle)
      setCurrentStep('🚀 Migration Supabase...');
      
      for (const user of backendlessUsers) {
        try {
          const result = await supabaseAuthService.register({
            email: user.email,
            password: 'Senegel2025!',
            name: user.name,
            role: user.role,
            skills: user.skills || []
          });
          
          if (result.success) {
            results.supabase.success++;
          } else {
            results.supabase.failed++;
            results.supabase.errors.push(`${user.name}: ${result.error}`);
          }
        } catch (error: any) {
          results.supabase.failed++;
          results.supabase.errors.push(`${user.name}: ${error.message}`);
        }
      }
      
      setProgress(80);

      // Étape 3: Migration des projets vers Supabase
      setCurrentStep('📁 Migration des projets...');
      
      for (const project of mockProjects) {
        try {
          const projectData = {
            title: project.title,
            description: project.description,
            status: project.status,
            priority: project.priority,
            start_date: project.startDate,
            end_date: project.endDate,
            due_date: project.dueDate,
            budget: project.budget || 0,
            progress: project.progress || 0,
            user_id: '550e8400-e29b-41d4-a716-446655440001', // Admin par défaut
            team_members: project.team.map(member => ({
              id: member.id,
              name: member.name,
              role: member.role,
              avatar: member.avatar
            }))
          };

          const result = await supabaseProjectService.createProject(projectData);
          
          if (result.success) {
            results.supabase.success++;
          } else {
            results.supabase.failed++;
            results.supabase.errors.push(`Projet ${project.title}: ${result.error}`);
          }
        } catch (error: any) {
          results.supabase.failed++;
          results.supabase.errors.push(`Projet ${project.title}: ${error.message}`);
        }
      }

      setProgress(100);
      setCurrentStep('✅ Migration terminée !');

      setMigrationStatus({
        success: true,
        results,
        summary: {
          totalUsers: backendlessUsers.length,
          totalProjects: mockProjects.length,
          backendlessSuccess: results.backendless.success,
          supabaseSuccess: results.supabase.success,
          totalSuccess: results.backendless.success + results.supabase.success,
          totalFailed: results.backendless.failed + results.supabase.failed
        }
      });

    } catch (error: any) {
      setMigrationStatus({
        success: false,
        error: error.message
      });
    } finally {
      setIsMigrating(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🔄 Migration Hybride Backendless + Supabase</h2>
        <button
          onClick={handleHybridMigration}
          disabled={isMigrating}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isMigrating
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
          }`}
        >
          {isMigrating ? 'Migration en cours...' : '🚀 Lancer Migration Hybride'}
        </button>
      </div>

      {isMigrating && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{currentStep}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-800 mb-2">🏗️ Architecture Hybride :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Backendless (Base)</h4>
            <ul className="text-blue-600 space-y-1">
              <li>✅ Authentification utilisateurs</li>
              <li>✅ Gestion des données de base</li>
              <li>✅ API REST simple</li>
              <li>✅ Hébergement géré</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700 mb-1">Supabase (Avancé)</h4>
            <ul className="text-purple-600 space-y-1">
              <li>✅ Base de données PostgreSQL</li>
              <li>✅ Temps réel avec WebSockets</li>
              <li>✅ Stockage de fichiers</li>
              <li>✅ Analytics avancées</li>
              <li>✅ Row Level Security (RLS)</li>
              <li>✅ Fonctions SQL personnalisées</li>
            </ul>
          </div>
        </div>
      </div>

      {migrationStatus && (
        <div className={`border rounded-lg p-4 ${
          migrationStatus.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            migrationStatus.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {migrationStatus.success ? '✅ Migration Hybride Réussie !' : '❌ Erreur de Migration'}
          </h3>
          
          {migrationStatus.success && migrationStatus.summary ? (
            <div className="text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-lg font-bold text-blue-600">{migrationStatus.summary.backendlessSuccess}</div>
                  <div className="text-xs text-gray-600">Backendless</div>
                </div>
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-lg font-bold text-purple-600">{migrationStatus.summary.supabaseSuccess}</div>
                  <div className="text-xs text-gray-600">Supabase</div>
                </div>
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-lg font-bold text-green-600">{migrationStatus.summary.totalSuccess}</div>
                  <div className="text-xs text-gray-600">Total Réussi</div>
                </div>
                <div className="bg-white p-3 rounded border text-center">
                  <div className="text-lg font-bold text-red-600">{migrationStatus.summary.totalFailed}</div>
                  <div className="text-xs text-gray-600">Échecs</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border">
                <h4 className="font-semibold text-gray-700 mb-2">📊 Résultats détaillés :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-semibold text-blue-700 mb-1">Backendless</h5>
                    <p>✅ {migrationStatus.results.backendless.success} utilisateurs migrés</p>
                    <p>❌ {migrationStatus.results.backendless.failed} échecs</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-purple-700 mb-1">Supabase</h5>
                    <p>✅ {migrationStatus.results.supabase.success} éléments migrés</p>
                    <p>❌ {migrationStatus.results.supabase.failed} échecs</p>
                  </div>
                </div>
              </div>

              {migrationStatus.results.backendless.errors.length > 0 && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h5 className="font-semibold text-yellow-800 mb-1">⚠️ Erreurs Backendless :</h5>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {migrationStatus.results.backendless.errors.slice(0, 3).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {migrationStatus.results.supabase.errors.length > 0 && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <h5 className="font-semibold text-yellow-800 mb-1">⚠️ Erreurs Supabase :</h5>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {migrationStatus.results.supabase.errors.slice(0, 3).map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-700 text-sm">
              {migrationStatus.error}
            </p>
          )}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">🎯 Avantages de l'Architecture Hybride</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Backendless :</strong> API simple, hébergement géré, authentification rapide</li>
          <li>• <strong>Supabase :</strong> Base PostgreSQL, temps réel, sécurité avancée, analytics</li>
          <li>• <strong>Résultat :</strong> Performance optimale + Fonctionnalités avancées</li>
          <li>• <strong>Scalabilité :</strong> Prêt pour 250k utilisateurs simultanés</li>
        </ul>
      </div>
    </div>
  );
};

export default HybridMigration;
