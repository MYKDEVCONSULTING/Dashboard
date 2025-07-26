# MYKDASHBOARD - Application de Tableau de Bord Professionnel

Une application web moderne de tableau de bord avec authentification sécurisée, gestion des utilisateurs hiérarchisée, et interface multilingue responsive.

## 🚀 Fonctionnalités

### Authentification et Sécurité
- **Authentification sécurisée** avec Supabase
- **Hiérarchie des rôles** : SuperAdmin, Admin, Employé
- **Routes protégées** basées sur les permissions
- **Sessions persistantes** avec gestion automatique

### Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Interface responsive** (mobile, tablette, desktop)
- **Thème sombre/clair** avec basculement en temps réel
- **Animations fluides** avec Framer Motion
- **Sidebar rétractable** avec navigation dynamique

### Fonctionnalités Multilingues
- **Support complet** : Français, Anglais, Arabe
- **Direction RTL** pour l'arabe
- **Changement de langue** en temps réel
- **Traductions complètes** de l'interface

### Gestion des Utilisateurs
- **CRUD complet** des utilisateurs
- **Attribution des rôles** avec permissions granulaires
- **Profils utilisateurs** avec informations détaillées
- **Historique de connexion**

### Système de Notifications
- **Notifications en temps réel** avec Supabase Realtime
- **Persistance en base de données**
- **Interface de gestion** complète
- **Différents types** : info, succès, avertissement, erreur

### Dashboard et Statistiques
- **Statistiques des IDE** de développement
- **Graphiques et métriques** interactifs
- **Cartes d'information** animées
- **Données en temps réel**

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Animation** : Framer Motion
- **Routing** : React Router DOM
- **État Global** : Context API
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Build Tool** : Vite
- **Notifications** : React Hot Toast

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd mykdashboard
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**

Créez un nouveau projet sur [Supabase](https://supabase.com) et configurez :

- Copiez `.env.example` vers `.env`
- Ajoutez vos clés Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

4. **Configuration de la base de données**

Exécutez le script SQL dans l'éditeur SQL de Supabase :
```sql
-- Contenu du fichier supabase/migrations/create_initial_schema.sql
```

5. **Lancer l'application**
```bash
npm run dev
```

## 🔐 Comptes de Test

### SuperAdmin
- **Login** : `MYK`
- **Mot de passe** : `admin123`
- **Permissions** : Toutes les fonctionnalités

### Admin (à créer)
- **Permissions** : Gestion des utilisateurs (limité)
- **Accès** : Dashboard, Utilisateurs, Paramètres, Notifications

### Employé (à créer)
- **Permissions** : Consultation uniquement
- **Accès** : Dashboard, Paramètres, Notifications

## 🏗️ Architecture

### Structure des dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants d'interface de base
│   └── layout/         # Composants de mise en page
├── contexts/           # Contextes React (Auth, App)
├── pages/              # Pages de l'application
├── utils/              # Utilitaires et helpers
├── types/              # Types TypeScript
└── lib/                # Configuration externe (Supabase)
```

### Contextes principaux

#### AuthContext
- Gestion de l'authentification
- Informations utilisateur
- Connexion/Déconnexion

#### AppContext
- Thème et langue
- État de la sidebar
- Notifications en temps réel

## 🔧 Configuration

### Thèmes
L'application supporte les thèmes clair et sombre avec basculement automatique :
- Variables CSS personnalisées
- Classes Tailwind conditionnelles
- Persistance des préférences

### Langues
Support multilingue complet :
- Français (par défaut)
- Anglais  
- Arabe (avec support RTL)

### Permissions
Système de permissions granulaires :
- Basé sur les rôles utilisateur
- Contrôle d'accès aux routes
- Limitation des actions par interface

## 🚀 Déploiement

### Netlify (Recommandé)
1. Connectez votre repository
2. Configurez les variables d'environnement
3. Build command : `npm run build`
4. Publish directory : `dist`

### Vercel
1. Importez le projet
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres plateformes
L'application est compatible avec toutes les plateformes supportant les SPAs React.

## 🔒 Sécurité

### Authentification
- Mots de passe hachés avec bcrypt
- Sessions JWT sécurisées
- Protection CSRF automatique

### Base de données
- Row Level Security (RLS) activé
- Politiques par rôle utilisateur
- Validation des entrées

### Frontend
- Validation côté client
- Sanitisation des données
- Protection XSS

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les issues existantes
3. Créez une nouvelle issue si nécessaire

## 🎯 Roadmap

### Version 2.0
- [ ] Système de rapports avancés
- [ ] Intégration API externes
- [ ] Mode collaboratif
- [ ] Application mobile

### Version 2.1
- [ ] Système de plugins
- [ ] Thèmes personnalisables
- [ ] Export de données
- [ ] Sauvegardes automatiques

---

**MYKDASHBOARD** - *Tableau de bord professionnel moderne et sécurisé*