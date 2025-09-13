import React, { useState, useEffect } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  activeUsers: number;
  responseTime: number;
  errorRate: number;
}

const PerformanceMonitor: React.FC = () => {
  const { t } = useLocalization();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    activeUsers: 0,
    responseTime: 0,
    errorRate: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      // Simulation des métriques de performance
      setMetrics({
        loadTime: Math.random() * 2000 + 500, // 500-2500ms
        memoryUsage: Math.random() * 100, // 0-100%
        activeUsers: Math.floor(Math.random() * 1000) + 100, // 100-1100 utilisateurs
        responseTime: Math.random() * 500 + 100, // 100-600ms
        errorRate: Math.random() * 2 // 0-2%
      });
    };

    // Mise à jour toutes les 5 secondes
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Mise à jour initiale

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'fas fa-check-circle';
    if (value <= thresholds.warning) return 'fas fa-exclamation-triangle';
    return 'fas fa-times-circle';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        <i className="fas fa-tachometer-alt mr-2"></i>
        {t('performance_monitoring')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Temps de chargement */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <i className={`${getStatusIcon(metrics.loadTime, { good: 1000, warning: 2000 })} text-xl mr-2`}></i>
            <span className="text-sm font-medium text-gray-600">{t('load_time')}</span>
          </div>
          <div className={`text-2xl font-bold ${getStatusColor(metrics.loadTime, { good: 1000, warning: 2000 })}`}>
            {Math.round(metrics.loadTime)}ms
          </div>
        </div>

        {/* Utilisation mémoire */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <i className={`${getStatusIcon(metrics.memoryUsage, { good: 50, warning: 80 })} text-xl mr-2`}></i>
            <span className="text-sm font-medium text-gray-600">{t('memory_usage')}</span>
          </div>
          <div className={`text-2xl font-bold ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 80 })}`}>
            {Math.round(metrics.memoryUsage)}%
          </div>
        </div>

        {/* Utilisateurs actifs */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-users text-xl text-blue-600 mr-2"></i>
            <span className="text-sm font-medium text-gray-600">{t('active_users')}</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.activeUsers.toLocaleString()}
          </div>
        </div>

        {/* Temps de réponse */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <i className={`${getStatusIcon(metrics.responseTime, { good: 200, warning: 500 })} text-xl mr-2`}></i>
            <span className="text-sm font-medium text-gray-600">{t('response_time')}</span>
          </div>
          <div className={`text-2xl font-bold ${getStatusColor(metrics.responseTime, { good: 200, warning: 500 })}`}>
            {Math.round(metrics.responseTime)}ms
          </div>
        </div>

        {/* Taux d'erreur */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <i className={`${getStatusIcon(metrics.errorRate, { good: 0.5, warning: 1 })} text-xl mr-2`}></i>
            <span className="text-sm font-medium text-gray-600">{t('error_rate')}</span>
          </div>
          <div className={`text-2xl font-bold ${getStatusColor(metrics.errorRate, { good: 0.5, warning: 1 })}`}>
            {metrics.errorRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Barre de statut globale */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-server text-blue-600 mr-2"></i>
            <span className="text-sm font-medium text-gray-700">{t('system_status')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-green-600">{t('operational')}</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          {t('performance_status_message')}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
