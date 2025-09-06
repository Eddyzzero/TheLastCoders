# TheLastCoders 🚀

Une plateforme collaborative de partage de ressources de développement, construite avec Angular et Firebase.

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Déploiement](#déploiement)
- [API et Services](#api-et-services)
- [Contribution](#contribution)
- [Licence](#licence)

## 🎯 À propos

TheLastCoders est une application web moderne qui permet aux développeurs de partager, découvrir et organiser des ressources de développement. La plateforme offre un système de notation, de commentaires et de filtres avancés pour faciliter la découverte de contenu pertinent.

### 🌟 Fonctionnalités principales

- **Authentification sécurisée** avec Firebase Auth
- **Partage de liens** avec système de notation (étoiles)
- **Système de commentaires** interactif
- **Filtres avancés** par catégorie, difficulté, et mots-clés
- **Quiz de compétences** pour personnaliser l'expérience
- **Interface responsive** avec mode carousel et grille
- **Gestion des utilisateurs** avec profils détaillés
- **Panel d'administration** pour la modération

## 🛠 Technologies utilisées

### Frontend

- **Angular 19** - Framework principal
- **TypeScript** - Langage de programmation
- **Tailwind CSS** - Framework CSS
- **Angular Material** - Composants UI
- **RxJS** - Programmation réactive
- **Swiper.js** - Carousel interactif

### Backend & Services

- **Firebase Auth** - Authentification
- **Cloud Firestore** - Base de données NoSQL
- **Firebase Storage** - Stockage de fichiers
- **Firebase Hosting** - Hébergement

### Outils de développement

- **Angular CLI** - Outils de développement
- **ESLint** - Linting
- **Prettier** - Formatage de code
- **Git** - Contrôle de version

## 📁 Structure du projet

```
src/
├── app/
│   ├── core/                    # Services et composants partagés
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── nav-bar/         # Barre de navigation
│   │   │   └── notification/    # Système de notifications
│   │   ├── guards/              # Guards de routage
│   │   │   ├── auth.guard.ts    # Protection des routes
│   │   │   └── auth-redirect.guard.ts
│   │   └── services/            # Services métier
│   │       ├── fireAuth.service.ts      # Authentification
│   │       ├── firestore.service.ts     # Base de données
│   │       ├── links.service.ts         # Gestion des liens
│   │       ├── users.service.ts         # Gestion des utilisateurs
│   │       └── ...
│   ├── features/                # Modules fonctionnels
│   │   ├── auth/                # Authentification
│   │   │   ├── pages/           # Pages d'auth
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── skills-quiz/
│   │   │   └── interfaces/      # Types TypeScript
│   │   ├── home/                # Page d'accueil
│   │   │   ├── components/      # Composants spécifiques
│   │   │   ├── pages/           # Pages du module
│   │   │   └── interfaces/      # Types du module
│   │   ├── admin/               # Administration
│   │   └── users/               # Gestion des utilisateurs
│   ├── environments/            # Configurations d'environnement
│   ├── app.component.ts         # Composant racine
│   ├── app.config.ts           # Configuration de l'app
│   └── app.routes.ts           # Routes principales
├── assets/                     # Ressources statiques
└── styles.css                 # Styles globaux
```

## 🚀 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte Firebase

### Étapes d'installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/votre-username/TheLastCoders.git
   cd TheLastCoders
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration Firebase**

   - Créer un projet Firebase
   - Activer Authentication, Firestore et Storage
   - Copier la configuration dans `src/environments/environment.ts`

4. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

L'application sera accessible sur `http://localhost:4200`

## ⚙️ Configuration

### Variables d'environnement

Les configurations Firebase sont définies dans les fichiers d'environnement :

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "votre-api-key",
    authDomain: "votre-projet.firebaseapp.com",
    projectId: "votre-projet-id",
    // ... autres configurations
  },
};
```

### Configuration Firebase

1. **Authentication** : Activer Email/Password
2. **Firestore** : Configurer les règles de sécurité
3. **Storage** : Configurer les règles d'upload

## 🚀 Déploiement

### Déploiement sur Firebase Hosting

1. **Construire l'application**

   ```bash
   npm run build
   ```

2. **Déployer sur Firebase**
   ```bash
   firebase deploy --only hosting
   ```

### Configuration de déploiement

Le fichier `firebase.json` contient la configuration de déploiement :

```json
{
  "hosting": {
    "public": "dist/the-last-coders/browser",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🔧 API et Services

### Services principaux

#### AuthService

Gère l'authentification des utilisateurs :

```typescript
// Connexion
authService.login(email, password);

// Inscription
authService.register(email, userName, password);

// Déconnexion
authService.logOut();
```

#### FirestoreService

Service générique pour les opérations CRUD :

```typescript
// Créer un document
firestoreService.createDocument("users/userId", userData);

// Récupérer une collection
firestoreService.getCollection("links");

// Mettre à jour un document
firestoreService.updateDocument("links/linkId", updateData);
```

#### LinksService

Gestion spécifique des liens :

```typescript
// Ajouter un lien
linksService.addLink(linkData);

// Récupérer les liens filtrés
linksService.getFilteredLinks(filters);

// Noter un lien
linksService.rateLink(linkId, rating);
```

### Interfaces principales

```typescript
// Interface utilisateur
interface UserInterface {
  id: string;
  email: string;
  userName: string;
  createdAt: Date;
}

// Interface lien
interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  rating: number;
  authorId: string;
  createdAt: Date;
}
```

## 🧪 Tests

### Lancer les tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run e2e
```

### Tests de build

```bash
# Build de production
npm run build

# Analyse du bundle
npm run analyze-bundle
```

## 📝 Scripts disponibles

```bash
# Développement
npm start                 # Serveur de développement
npm run build            # Build de production
npm run watch            # Build en mode watch

# Tests
npm test                 # Tests unitaires
npm run test:ci          # Tests en mode CI

# Déploiement
npm run build:prod       # Build pour production
firebase deploy          # Déploiement Firebase
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Standards de code

- Utiliser TypeScript strict
- Suivre les conventions Angular
- Documenter les fonctions complexes
- Tester les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Me contacter

---

**TheLastCoders** - Partager, découvrir, apprendre ensemble 🚀
