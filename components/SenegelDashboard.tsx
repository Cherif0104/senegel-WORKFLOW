import React from 'react';
import { Course, Project, User, TimeLog, LeaveRequest, Invoice, Expense } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import PerformanceMonitor from './PerformanceMonitor';
import LazyBackendlessMigration from './LazyBackendlessMigration';
import HybridMigration from './HybridMigration';

interface SenegelDashboardProps {
  setView: (view: string) => void;
  projects: Project[];
  courses: Course[];
  users: User[];
  timeLogs: TimeLog[];
  leaveRequests: LeaveRequest[];
  invoices: Invoice[];
  expenses: Expense[];
}

const SenegelDashboard: React.FC<SenegelDashboardProps> = ({
  setView,
  projects,
  courses,
  users,
  timeLogs,
  leaveRequests,
  invoices,
  expenses
}) => {
  const { t } = useLocalization();

  // Statistiques calculées
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  
  // Revenus et dépenses
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Temps de travail
  const totalTimeLogged = timeLogs.reduce((sum, log) => sum + log.duration, 0);
  const hoursLogged = Math.round(totalTimeLogged / 60);

  return (
    <div className="space-y-6">
      {/* Migration Hybride Backendless + Supabase - PRIORITAIRE */}
      <HybridMigration />
      
      {/* Migration Backendless - LEGACY */}
      <LazyBackendlessMigration />

      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">{t('senegel_workflow_platform')}</h1>
        <p className="text-blue-100">L'Écosystème Intelligent pour l'Ambition en Afrique</p>
        <div className="mt-4 text-sm">
          <p>Plateforme de Gestion et Formation Professionnelle</p>
          <p>Développée pour SENEGEL</p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('total_users')}</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-book text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('total_courses')}</p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <i className="fas fa-project-diagram text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('active_projects')}</p>
              <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <i className="fas fa-clock text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('hours_logged')}</p>
              <p className="text-2xl font-bold text-gray-900">{hoursLogged}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formations récentes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('recent_courses')}</h3>
            <button
              onClick={() => setView('courses')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('view_all_courses')}
            </button>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <i className={`${course.icon} text-blue-600 mr-3`}></i>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{course.progress}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projets actifs */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('active_projects')}</h3>
            <button
              onClick={() => setView('projects')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {t('view_all_projects')}
            </button>
          </div>
          <div className="space-y-3">
            {projects.filter(p => p.status === 'In Progress').slice(0, 3).map((project) => (
              <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{project.team.length} membres</span>
                  <span className="text-gray-500">{project.tasks.length} tâches</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métriques financières */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('financial_overview')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} FCFA</div>
            <div className="text-sm text-gray-600">{t('total_revenue')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString()} FCFA</div>
            <div className="text-sm text-gray-600">{t('total_expenses')}</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netIncome.toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-600">{t('net_income')}</div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quick_actions')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setView('course_management')}
            className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <i className="fas fa-plus-circle text-2xl text-blue-600 mb-2"></i>
            <div className="text-sm font-medium text-gray-900">{t('add_course')}</div>
          </button>
          <button
            onClick={() => setView('projects')}
            className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <i className="fas fa-project-diagram text-2xl text-green-600 mb-2"></i>
            <div className="text-sm font-medium text-gray-900">{t('new_project')}</div>
          </button>
          <button
            onClick={() => setView('user_management')}
            className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <i className="fas fa-user-plus text-2xl text-purple-600 mb-2"></i>
            <div className="text-sm font-medium text-gray-900">{t('add_user')}</div>
          </button>
          <button
            onClick={() => setView('analytics')}
            className="p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <i className="fas fa-chart-bar text-2xl text-orange-600 mb-2"></i>
            <div className="text-sm font-medium text-gray-900">{t('view_analytics')}</div>
          </button>
        </div>
      </div>

      {/* Monitoring des performances */}
        <PerformanceMonitor />
    </div>
  );
};

export default SenegelDashboard;
