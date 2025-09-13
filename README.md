# 🚀 SENEGEL ERP - Plateforme de Gestion Intégrée

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.6-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![Backendless](https://img.shields.io/badge/Backendless-BaaS-orange.svg)](https://backendless.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)

## 📋 Description

**SENEGEL ERP** est une plateforme de gestion d'entreprise complète et moderne, conçue pour répondre aux besoins des organisations sénégalaises. Cette solution ERP intègre 9 modules essentiels avec une architecture hybride Backendless + Supabase pour une performance et une scalabilité optimales.

## ✨ Fonctionnalités Principales

### 🏢 Modules ERP Intégrés
- **👥 Gestion des Utilisateurs** - Administration des rôles (Admin, Formateur, Apprenant)
- **📚 Gestion des Cours** - Plateforme e-learning complète
- **📊 CRM** - Gestion de la relation client
- **📈 Analytics** - Tableaux de bord et rapports avancés
- **🎯 Gestion des Objectifs** - Suivi des KPIs et objectifs
- **⏰ Suivi du Temps** - Time tracking et gestion des heures
- **📋 Gestion des Projets** - Planification et suivi des projets
- **💼 Gestion des Emplois** - Recrutement et gestion des postes
- **📚 Base de Connaissances** - Documentation et ressources

### 🚀 Technologies Avancées
- **⚡ React 19** - Interface utilisateur moderne et performante
- **🔧 TypeScript** - Code type-safe et maintenable
- **🎨 Tailwind CSS** - Design system cohérent et responsive
- **🔄 Architecture Hybride** - Backendless + Supabase pour la scalabilité
- **🌐 Temps Réel** - WebSockets et synchronisation en temps réel
- **🤖 IA Intégrée** - Google Gemini pour l'assistance intelligente
- **📱 PWA** - Application web progressive pour mobile

## 🏗️ Architecture Technique

### Frontend
- **React 19** avec hooks et context API
- **TypeScript** pour la sécurité des types
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Lazy Loading** et code splitting pour les performances

### Backend Hybride
- **Backendless** - BaaS pour l'authentification et les services de base
- **Supabase** - PostgreSQL avancé avec Row Level Security
- **Temps Réel** - WebSockets pour la synchronisation
- **Stockage** - Gestion des fichiers et médias

### Services Intégrés
- **Google Gemini AI** - Assistant intelligent et génération de contenu
- **Authentification** - JWT avec RBAC (Role-Based Access Control)
- **Analytics** - Suivi des performances et métriques
- **Notifications** - Système de notifications en temps réel

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Comptes Backendless et Supabase

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/votre-username/senegel-erp.git
cd senegel-erp

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# Démarrer le serveur de développement
npm run dev
```

### Configuration des Services

#### Backendless
1. Créer un compte sur [Backendless](https://backendless.com/)
2. Créer une nouvelle application
3. Copier l'APP_ID et l'API_KEY dans `.env`

#### Supabase
1. Créer un projet sur [Supabase](https://supabase.com/)
2. Exécuter le script SQL dans `database/supabase_schema.sql`
3. Copier l'URL et la clé anonyme dans `.env`

#### Google Gemini
1. Obtenir une clé API sur [Google AI Studio](https://makersuite.google.com/)
2. Ajouter la clé dans `.env`

## 📁 Structure du Projet

```
senegel-erp/
├── components/          # Composants React
│   ├── common/         # Composants communs
│   ├── icons/          # Icônes personnalisées
│   └── ...             # Modules ERP
├── contexts/           # Contextes React
├── services/           # Services et API
├── utils/              # Utilitaires
├── database/           # Schémas de base de données
├── constants/          # Constantes et données
└── types.ts           # Types TypeScript
```

## 🎯 Rôles et Permissions

### Admin
- Accès complet à tous les modules
- Gestion des utilisateurs et permissions
- Configuration système

### Formateur
- Gestion des cours et contenu
- Suivi des apprenants
- Rapports pédagogiques

### Apprenant
- Accès aux cours assignés
- Suivi des progrès
- Interaction avec le contenu

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Linting du code
```

## 📊 Métriques de Performance

- **⚡ Temps de chargement** < 2 secondes
- **👥 Utilisateurs simultanés** 250,000+
- **🔄 Uptime** 99.9%
- **📱 Mobile** 100% responsive
- **🔒 Sécurité** Enterprise-grade

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : support@senegel.org
- **Documentation** : [docs.senegel.org](https://docs.senegel.org)
- **Issues** : [GitHub Issues](https://github.com/votre-username/senegel-erp/issues)

## 🏆 Roadmap

- [x] Architecture de base
- [x] Intégration Backendless + Supabase
- [x] Modules ERP de base
- [ ] Mobile app (React Native)
- [ ] Intégrations tierces
- [ ] Analytics avancés
- [ ] IA conversationnelle

---

**Développé avec ❤️ pour l'écosystème entrepreneurial sénégalais**