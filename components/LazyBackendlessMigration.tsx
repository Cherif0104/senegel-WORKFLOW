// Composant de migration Backendless avec chargement paresseux
import React, { useState, useEffect, Suspense } from 'react';

// Chargement paresseux du composant de migration
const BackendlessMigration = React.lazy(() => import('./BackendlessMigration'));

const LazyBackendlessMigration: React.FC = () => {
  const [showMigration, setShowMigration] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🔄 Migration Backendless</h2>
        <button
          onClick={() => setShowMigration(!showMigration)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {showMigration ? 'Masquer' : 'Afficher'} Migration
        </button>
      </div>

      {showMigration && (
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Chargement de la migration...</span>
          </div>
        }>
          <BackendlessMigration />
        </Suspense>
      )}

      {!showMigration && (
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
          <p className="text-xs text-blue-600 mt-2">
            Clique sur "Afficher Migration" pour lancer la migration des données.
          </p>
        </div>
      )}
    </div>
  );
};

export default LazyBackendlessMigration;
