// Composant pour la migration des données vers Backendless
import React, { useState, useEffect } from 'react';
import { dataMigrationService } from '../services/dataMigrationService';

const BackendlessMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<any>(null);
  const [showMigration, setShowMigration] = useState(false);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationStatus(null);
    
    try {
      const result = await dataMigrationService.migrateAll();
      setMigrationStatus(result);
    } catch (error) {
      setMigrationStatus({
        success: false,
        error: error.message
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🔄 Migration Backendless</h2>
        <button
          onClick={() => setShowMigration(!showMigration)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showMigration ? 'Masquer' : 'Afficher'} Migration
        </button>
      </div>

      {showMigration && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Tables créées dans Backendless :</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✅ Users (existante - gestion authentification)</li>
              <li>✅ Projects (projets et tâches)</li>
              <li>✅ Courses (cours et formation)</li>
              <li>✅ TimeLogs (suivi du temps)</li>
              <li>✅ LeaveRequests (demandes de congés)</li>
              <li>✅ Invoices (factures)</li>
              <li>✅ Expenses (dépenses)</li>
              <li>✅ Goals (objectifs OKR)</li>
              <li>✅ Contacts (CRM)</li>
              <li>✅ Documents (base de connaissances)</li>
              <li>✅ Meetings (réunions)</li>
              <li>✅ Budgets (budgets)</li>
            </ul>
          </div>

          <button
            onClick={handleMigration}
            disabled={isMigrating}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              isMigrating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isMigrating ? '🔄 Migration en cours...' : '🚀 Lancer la Migration'}
          </button>

          {migrationStatus && (
            <div className={`border rounded-lg p-4 ${
              migrationStatus.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`font-semibold mb-2 ${
                migrationStatus.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {migrationStatus.success ? '✅ Migration Réussie !' : '❌ Erreur de Migration'}
              </h3>
              
              {migrationStatus.success && migrationStatus.summary ? (
                <div className="text-sm">
                  <p className="text-green-700 mb-2">
                    <strong>{migrationStatus.summary.totalSuccess}</strong> / {migrationStatus.summary.totalItems} éléments migrés
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-semibold text-gray-700 mb-1">👥 Utilisateurs</h4>
                      <p className="text-gray-600">
                        {migrationStatus.summary.users.filter((r: any) => r.success).length} / {migrationStatus.summary.users.length} migrés
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-semibold text-gray-700 mb-1">📁 Projets</h4>
                      <p className="text-gray-600">
                        {migrationStatus.summary.projects.filter((r: any) => r.success).length} / {migrationStatus.summary.projects.length} migrés
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-semibold text-gray-700 mb-1">📚 Cours</h4>
                      <p className="text-gray-600">
                        {migrationStatus.summary.courses.filter((r: any) => r.success).length} / {migrationStatus.summary.courses.length} migrés
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-red-700 text-sm">
                  {migrationStatus.error}
                </p>
              )}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h3>
            <p className="text-sm text-yellow-700">
              La migration va transférer toutes les données mock vers Backendless. 
              Une fois terminée, l'application utilisera la vraie base de données Backendless.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendlessMigration;
