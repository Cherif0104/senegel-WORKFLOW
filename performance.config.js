// Configuration de performance pour SENEGEL WorkFlow
// Optimisé pour supporter 250 000 utilisateurs simultanés

export const performanceConfig = {
  // Configuration de pagination pour les grandes listes
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    virtualScrolling: true
  },

  // Configuration de cache
  cache: {
    userData: 300000, // 5 minutes
    courseData: 600000, // 10 minutes
    projectData: 300000, // 5 minutes
    analyticsData: 1800000 // 30 minutes
  },

  // Configuration de débounce pour les recherches
  debounce: {
    search: 300, // 300ms
    autoSave: 2000, // 2 secondes
    apiCalls: 500 // 500ms
  },

  // Configuration de lazy loading
  lazyLoading: {
    images: true,
    components: true,
    routes: true
  },

  // Configuration de compression
  compression: {
    gzip: true,
    brotli: true,
    minify: true
  },

  // Configuration de base de données
  database: {
    connectionPool: 100,
    queryTimeout: 30000, // 30 secondes
    maxRetries: 3
  },

  // Configuration de monitoring
  monitoring: {
    performanceMetrics: true,
    errorTracking: true,
    userAnalytics: true,
    realTimeMonitoring: true
  },

  // Configuration de sécurité
  security: {
    rateLimiting: {
      requests: 1000, // par minute par utilisateur
      burst: 100 // requêtes en rafale
    },
    sessionTimeout: 3600000, // 1 heure
    maxConcurrentSessions: 3
  }
};

export default performanceConfig;
