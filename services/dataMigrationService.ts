// Service de migration des données mock vers Backendless
// Automatise la création des tables et l'insertion des données

import { projectService, courseService, authService } from './backendlessService';
import { mockProjects, mockCourses, mockAllUsers } from '../constants/data';

export const dataMigrationService = {
  // Migrer tous les utilisateurs
  async migrateUsers() {
    console.log('🔄 Migration des utilisateurs vers Backendless...');
    
    const users = Object.values(mockAllUsers);
    const results = [];
    
    for (const user of users) {
      try {
        const result = await authService.register({
          email: user.email,
          password: 'Senegel2025!',
          name: user.name,
          role: user.role,
          skills: user.skills || []
        });
        
        if (result.success) {
          console.log(`✅ Utilisateur migré: ${user.name}`);
          results.push({ success: true, user: user.name });
        } else {
          console.log(`❌ Erreur migration utilisateur: ${user.name}`, result.error);
          results.push({ success: false, user: user.name, error: result.error });
        }
      } catch (error) {
        console.error(`❌ Erreur migration utilisateur: ${user.name}`, error);
        results.push({ success: false, user: user.name, error: error.message });
      }
    }
    
    return results;
  },

  // Migrer tous les projets
  async migrateProjects() {
    console.log('🔄 Migration des projets vers Backendless...');
    
    const results = [];
    
    for (const project of mockProjects) {
      try {
        const projectData = {
          title: project.title,
          description: project.description,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          endDate: project.endDate,
          budget: project.budget,
          progress: project.progress,
          team: project.team.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role,
            avatar: member.avatar
          })),
          createdAt: new Date().toISOString()
        };

        const result = await projectService.createProject(projectData);
        
        if (result.success) {
          console.log(`✅ Projet migré: ${project.title}`);
          results.push({ success: true, project: project.title });
        } else {
          console.log(`❌ Erreur migration projet: ${project.title}`, result.error);
          results.push({ success: false, project: project.title, error: result.error });
        }
      } catch (error) {
        console.error(`❌ Erreur migration projet: ${project.title}`, error);
        results.push({ success: false, project: project.title, error: error.message });
      }
    }
    
    return results;
  },

  // Migrer tous les cours
  async migrateCourses() {
    console.log('🔄 Migration des cours vers Backendless...');
    
    const results = [];
    
    for (const course of mockCourses) {
      try {
        const courseData = {
          title: course.title,
          description: course.description,
          instructor: course.instructor,
          duration: course.duration,
          level: course.level,
          category: course.category,
          thumbnail: course.thumbnail,
          progress: course.progress || 0,
          status: course.status || 'active',
          createdAt: new Date().toISOString()
        };

        const result = await courseService.createCourse(courseData);
        
        if (result.success) {
          console.log(`✅ Cours migré: ${course.title}`);
          results.push({ success: true, course: course.title });
        } else {
          console.log(`❌ Erreur migration cours: ${course.title}`, result.error);
          results.push({ success: false, course: course.title, error: result.error });
        }
      } catch (error) {
        console.error(`❌ Erreur migration cours: ${course.title}`, error);
        results.push({ success: false, course: course.title, error: error.message });
      }
    }
    
    return results;
  },

  // Migration complète
  async migrateAll() {
    console.log('🚀 Début de la migration complète vers Backendless...');
    
    try {
      // 1. Migrer les utilisateurs
      const usersResult = await this.migrateUsers();
      console.log(`📊 Utilisateurs migrés: ${usersResult.filter(r => r.success).length}/${usersResult.length}`);
      
      // 2. Migrer les projets
      const projectsResult = await this.migrateProjects();
      console.log(`📊 Projets migrés: ${projectsResult.filter(r => r.success).length}/${projectsResult.length}`);
      
      // 3. Migrer les cours
      const coursesResult = await this.migrateCourses();
      console.log(`📊 Cours migrés: ${coursesResult.filter(r => r.success).length}/${coursesResult.length}`);
      
      // Résumé
      const totalSuccess = usersResult.filter(r => r.success).length + 
                          projectsResult.filter(r => r.success).length + 
                          coursesResult.filter(r => r.success).length;
      const totalItems = usersResult.length + projectsResult.length + coursesResult.length;
      
      console.log(`🎉 Migration terminée: ${totalSuccess}/${totalItems} éléments migrés avec succès`);
      
      return {
        success: true,
        summary: {
          users: usersResult,
          projects: projectsResult,
          courses: coursesResult,
          totalSuccess,
          totalItems
        }
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de la migration:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default dataMigrationService;
